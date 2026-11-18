#!/usr/bin/env python3
"""Checks that guides follow the ranking-page structure. Usage: check-guide-structure.py [files...]"""
import re, sys, glob, yaml

LEVELS = {'低', '中', '高'}; EFFORT = {'かんたん', 'ふつう', '手間がかかる'}
def check(path):
    errs = []
    src = open(path, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', src, re.S)
    fm, body = yaml.safe_load(m.group(1)), m.group(2)
    methods = fm.get('methods') or []
    n = len(methods)
    if not 2 <= n <= 10: errs.append(f'methods: need 2-10, got {n}')
    for k, lo, hi in (('criteria', 3, 5), ('checklist', 3, 6)):
        if not lo <= len(fm.get(k) or []) <= hi: errs.append(f'{k}: need {lo}-{hi} items')
    if f'{n}選' not in fm.get('h1', ''): errs.append(f'h1 must contain "{n}選"')
    if f'{n}選' not in fm.get('title', ''): errs.append(f'title must contain "{n}選"')
    for i, me in enumerate(methods):
        for f in ('name', 'bestFor', 'strength', 'effort', 'cost'):
            if not me.get(f): errs.append(f'methods[{i}].{f} missing')
        if me.get('strength') not in LEVELS: errs.append(f'methods[{i}].strength must be 低/中/高')
        if me.get('effort') not in EFFORT: errs.append(f'methods[{i}].effort must be かんたん/ふつう/手間がかかる')
        if len(me.get('name', '')) > 40 or len(me.get('bestFor', '')) > 40: errs.append(f'methods[{i}] name/bestFor > 40 chars')
        if len(me.get('pick', '') or '') > 16: errs.append(f'methods[{i}].pick > 16 chars')
    if not any(me.get('pick') for me in methods): errs.append('at least one method needs a pick label')
    h2 = re.findall(r'^## (.+)$', body, re.M)
    nums = [h for h in h2 if re.match(r'方法\d+：', h)]
    if [re.match(r'方法(\d+)', h).group(1) for h in nums] != [str(i + 1) for i in range(n)]:
        errs.append(f'body needs "## 方法1：" … "## 方法{n}：" in order; found {nums}')
    # numbered methods must be contiguous H2s
    idx = [i for i, h in enumerate(h2) if h in nums]
    if idx and idx != list(range(idx[0], idx[0] + len(idx))): errs.append('方法N H2 sections must be consecutive (move explainer H2s before/after them)')
    sections = re.split(r'^## ', body, flags=re.M)
    for sec in sections:
        if not re.match(r'方法\d+：', sec): continue
        t = sec.splitlines()[0]
        for pat, lbl in ((r'^\*\*良い点\*\*\s*$', '**良い点**'), (r'^\*\*注意点\*\*\s*$', '**注意点**'), (r'^\*\*判定：\*\*', '**判定：**')):
            if not re.search(pat, sec, re.M): errs.append(f'"{t}": missing {lbl} block')
    return errs

files = sys.argv[1:] or sorted(glob.glob('src/content/guides/*.md'))
bad = 0
for f in files:
    e = check(f)
    if e: bad += 1; print(f'✗ {f}'); [print('   -', x) for x in e]
    else: print(f'✓ {f}')
sys.exit(1 if bad else 0)

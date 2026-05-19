#!/usr/bin/env bash
set -euo pipefail

echo "=== 运行 ESLint... ==="
npx eslint src/ test/ --ext .ts

echo "=== 运行 TypeScript 类型检查... ==="
npx tsc --noEmit

echo "=== 运行测试... ==="
npx jest --forceExit --detectOpenHandles

echo "=== 所有检查通过 ==="
echo ""
echo "提示: Lefthook 已配置，git commit/push 时会自动触发检查。"
echo "运行 'npx lefthook install' 安装 hooks（仅需一次）。"

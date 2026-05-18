#!/usr/bin/env bash
set -euo pipefail

echo "=== 运行 ESLint... ==="
npx eslint src/ test/ --ext .ts

echo "=== 运行 TypeScript 类型检查... ==="
npx tsc --noEmit

echo "=== 运行测试... ==="
npx jest --forceExit --detectOpenHandles

echo "=== 所有检查通过 ==="

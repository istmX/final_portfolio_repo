#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { constants, existsSync } from 'node:fs'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const VERSION = '0.1.7'
const COMPONENTS = {
  'animated-text': { fileName: 'animated-text.tsx' },
  'image-accordion': { fileName: 'image-accordion.tsx' },
  'dock-navigation': {
    fileName: 'dock-navigation.tsx',
    dependencies: ['@tabler/icons-react'],
  },
  'mobile-menu-dock': {
    fileName: 'mobile-menu-dock.tsx',
    dependencies: ['@tabler/icons-react'],
  },
  'scroll-story-cards': {
    fileName: 'scroll-story-cards.tsx',
    dependencies: ['@tabler/icons-react'],
  },
  'pixel-cat': { fileName: 'pixel-cat.tsx' },
}
const DEPENDENCIES = ['motion', 'clsx', 'tailwind-merge']
const COMMANDS = {
  npm: ['install'],
  pnpm: ['add'],
  yarn: ['add'],
  bun: ['add'],
}
const CURRENT_DIRECTORY = process.cwd()
const PACKAGE_DIRECTORY = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const REGISTRY_DIRECTORY = path.join(PACKAGE_DIRECTORY, 'registry')
const USE_COLOR = Boolean(process.stdout.isTTY && !process.env.NO_COLOR)

const color = (code, value) =>
  USE_COLOR ? `\u001B[${code}m${value}\u001B[0m` : value
const cyan = (value) => color('36;1', value)
const muted = (value) => color('2', value)
const green = (value) => color('32;1', value)
const red = (value) => color('31;1', value)

function printHeader() {
  console.log(`\n${cyan('┌')} ${cyan('ISTMX UI')} ${muted(`v${VERSION}`)}`)
  console.log(`${cyan('│')} ${muted('Editable components for your codebase')}`)
  console.log(`${cyan('└')}${muted('─'.repeat(42))}\n`)
}

function printStep(label) {
  console.log(`${cyan('◇')} ${label}`)
}

function printSuccess(label) {
  console.log(`${green('✔')} ${label}`)
}

function printHelp() {
  printHeader()
  console.log(`Usage:

  istmx add <component> [--no-install] [--overwrite]
  istmx --help
  istmx --version

Options:
  --no-install  Write component files without installing dependencies
  --overwrite   Replace component files that already exist

Components:
${Object.keys(COMPONENTS)
  .map((name) => `  ${name}`)
  .join('\n')}`)
}

function detectPackageManager(projectPackage) {
  const userAgent = process.env.npm_config_user_agent ?? ''
  const managerFromUserAgent = userAgent.match(/^(npm|pnpm|yarn|bun)\//)?.[1]

  if (managerFromUserAgent) return managerFromUserAgent

  const managerFromPackage =
    typeof projectPackage.packageManager === 'string'
      ? projectPackage.packageManager.match(/^(npm|pnpm|yarn|bun)@/)?.[1]
      : undefined

  if (managerFromPackage) return managerFromPackage

  const lockfiles = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['bun.lock', 'bun'],
    ['bun.lockb', 'bun'],
    ['package-lock.json', 'npm'],
  ]

  for (const [lockfile, manager] of lockfiles) {
    if (existsSync(path.join(CURRENT_DIRECTORY, lockfile))) return manager
  }

  return 'npm'
}

async function readProjectPackage() {
  const packagePath = path.join(CURRENT_DIRECTORY, 'package.json')
  try {
    const content = await readFile(packagePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Could not parse the project package.json.')
    }
    throw new Error('Run `istmx add` from a project folder with package.json.')
  }
}

function installedDependencies(projectPackage) {
  return {
    ...projectPackage.dependencies,
    ...projectPackage.devDependencies,
    ...projectPackage.optionalDependencies,
  }
}

function dependencyCommand(manager, dependencies) {
  return [manager, ...COMMANDS[manager], ...dependencies]
}

async function writeRegistryFile(sourceName, targetPath, overwrite) {
  const content = await readFile(
    path.join(REGISTRY_DIRECTORY, sourceName),
    'utf8',
  )
  await mkdir(path.dirname(targetPath), { recursive: true })

  try {
    await access(targetPath, constants.F_OK)
    if (!overwrite) {
      console.log(
        `${muted('·')} Kept existing ${path.relative(CURRENT_DIRECTORY, targetPath)}`,
      )
      return false
    }
  } catch {
    // Target file does not exist yet.
  }

  await writeFile(targetPath, content, 'utf8')
  printSuccess(`Added ${path.relative(CURRENT_DIRECTORY, targetPath)}`)
  return true
}

function installDependencies(manager, dependencies) {
  if (dependencies.length === 0) {
    printSuccess('Dependencies are already present.')
    return true
  }

  const [command, ...args] = dependencyCommand(manager, dependencies)
  printStep(`Installing dependencies with ${manager}`)
  console.log(`  ${muted(dependencies.join(' · '))}`)
  const result = spawnSync(command, args, {
    cwd: CURRENT_DIRECTORY,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status === 0) {
    printSuccess('Dependencies installed.')
    return true
  }

  return false
}

async function addComponent(component, options) {
  const definition = COMPONENTS[component]
  if (!definition) {
    throw new Error(
      `Unknown component "${component}". Available components: ${Object.keys(COMPONENTS).join(', ')}. Run istmx --help to see available components.`,
    )
  }
  const componentDependencies = [
    ...new Set([...DEPENDENCIES, ...(definition.dependencies ?? [])]),
  ]

  const projectPackage = await readProjectPackage()
  const manager = detectPackageManager(projectPackage)
  printHeader()
  console.log(
    `${muted('Adding')} ${cyan(component)} ${muted('to your project')}\n`,
  )
  printStep('Writing editable source files')
  const componentPath = path.join(
    CURRENT_DIRECTORY,
    'components',
    'ui',
    definition.fileName,
  )
  const utilityPath = path.join(CURRENT_DIRECTORY, 'lib', 'utils.ts')

  await writeRegistryFile('utils.ts', utilityPath, options.overwrite)
  await writeRegistryFile(definition.fileName, componentPath, options.overwrite)

  if (options.noInstall) {
    const missing = componentDependencies.filter(
      (dependency) => !installedDependencies(projectPackage)[dependency],
    )
    if (missing.length > 0) {
      printStep('Install the required dependencies manually')
      console.log(`  ${cyan(dependencyCommand(manager, missing).join(' '))}`)
    }
    printSuccess('Source files are ready.')
    return
  }

  const installed = installedDependencies(projectPackage)
  const missingDependencies = componentDependencies.filter(
    (dependency) => !installed[dependency],
  )

  if (!installDependencies(manager, missingDependencies)) {
    throw new Error(
      `Dependency installation failed. Run ${dependencyCommand(manager, missingDependencies).join(' ')} and try again.`,
    )
  }

  console.log(`\n${green('Done!')} ${component} is ready to edit.`)
  console.log(
    `  ${muted('Import from')} ${cyan(`@/components/ui/${component}`)}`,
  )
  console.log(
    `  ${muted('Dependencies')} ${cyan(componentDependencies.join(', '))}\n`,
  )
}

const [command, ...argumentsList] = process.argv.slice(2)
const component = argumentsList
  .filter((argument) => !argument.startsWith('--'))
  .join('-')
  .toLowerCase()
const options = {
  noInstall: argumentsList.includes('--no-install'),
  overwrite: argumentsList.includes('--overwrite'),
}

if (command === '--help' || command === '-h' || !command) {
  printHelp()
} else if (command === '--version' || command === '-v') {
  console.log(VERSION)
} else if (command === 'add') {
  if (!component || component.startsWith('--')) {
    console.error('Choose a component name. Run `istmx --help` to see options.')
    process.exitCode = 1
  } else {
    addComponent(component, options).catch((error) => {
      console.error(`\n${red('✖')} ${error.message}`)
      process.exitCode = 1
    })
  }
} else {
  console.error(
    `${red('✖')} Unknown command "${command}". Run istmx --help for usage.`,
  )
  process.exitCode = 1
}

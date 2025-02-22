const { spawn } = require('node:child_process');
const { styleText } = require('node:util');
const inquirer = require('inquirer').default;

async function main() {
  // Get install commands in sequential order
  const commands = [
    // Android
    await getPlatformInstallPath('cordova-android', { nightly: true }),
    // iOS
    await getPlatformInstallPath('cordova-ios', { nightly: true }),
    // Plugins
    await getPluginInstallPath('cordova-plugin-media-capture', { nightly: false })
  ];

  // Execute commands
  await runCmdSequentially(commands);
}

async function getPlatformInstallPath(target, opts) {
  return await getInstallPath('platform', target, opts);
}

async function getPluginInstallPath(target, opts) {
  return await getInstallPath('plugin', target, opts);
}

async function getInstallPath(type, target, opts) {
  const answers = await inquirer.prompt([
    {
      message: `${target} Version`,
      name: 'src',
      type: 'list',
      pageSize: 10,
      loop: false,
      choices: [
        new inquirer.Separator('npm'),
        { name: 'latest', value: 'npm:latest' },
        opts.nightly !== false && { name: 'nightly', value: 'npm:nightly' },
        { name: 'manual input', value: 'npm:version' },
        new inquirer.Separator('git'),
        { name: 'main branch', value: 'git:master' },
        { name: 'another branch', value: 'git:branch' },
        { name: 'another repo ', value: 'git-custom:' },
      ].filter(Boolean),
      default: 'npm:latest'
    }
  ]);

  const [src, version] = answers.src.split(':');

  answers.src = src;
  answers.version = version;

  if (answers.src === 'npm' && answers.version === 'version') {
    answers.version = await getCustomNpmVersion();
  }

  if (answers.src === 'git' && answers.version === 'branch') {
    answers.version = '#' + await getBranch();
  }

  if (answers.src === 'git' && answers.version === 'master') {
    answers.version = ''; // dont need to append master
  }

  if (answers.src === 'git-custom') {
    answers.version = await getCustomRepo();
  }

  switch (answers.src) {
    case 'npm':
    return `cordova ${type} add ${target}@${answers.version}`;
    case 'git':
    return `cordova ${type} add github:apache/${target}${answers.version}`;
    case 'git-custom':
    return `cordova ${type} add ${answers.version}`;
  }
}

async function getCustomNpmVersion() {
  const answer = await inquirer.prompt([{
    name: 'version',
    message: 'NPM Version:',
    validate: version => /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(version)
  }]);

  return answer.version;
}

async function getBranch() {
  const answer = await inquirer.prompt([{
    name: 'version',
    message: 'Git Branch:'
  }]);

  return answer.version;
}

async function getCustomRepo() {
  const answer = await inquirer.prompt([{
    name: 'version',
    message: 'Git Custom Repo:'
  }]);

  return answer.version;
}

const runCmd = async (cmd) => {
  return new Promise((resolve, reject) => {
    const [command, ...args] = cmd.split(' ');
    const process = spawn(command, args, { stdio: 'inherit', shell: true });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed: ${cmd}`));
      }
    });
  });
};

const runCmdSequentially = async (commands) => {
  try {
    for (const cmd of commands) {
      console.log(styleText(['green', 'bold'], `\n⚡ ${cmd}\n`));
      await runCmd(cmd);
    }
    console.log(styleText(['green', 'bold'], '\n✅ Successfully configured project.'));
  } catch (error) {
    console.error(styleText(['red', 'bold'], '\n❌ Failed to configure project with following error:\n'), error.message);
    process.exit(1);
  }
};

main();

process.on('uncaughtException', (error) => {
  if (error instanceof Error && error.name === 'ExitPromptError') {
    console.log(styleText(['red', 'bold'], '\n👋 Setup was stopped.'));
  } else {
    throw error;
  }
});

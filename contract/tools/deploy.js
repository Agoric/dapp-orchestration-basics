/** @file run a builder and deploy it onto the Agoric chain in local Starship cluster */

export const makeDeployBuilder = (tools, readJSON, execa) =>
  async function deployBuilder(builder) {
    console.log(`building plan: ${builder}`);
    // build the plan
    const { stdout } = await execa`agoric run ${builder}`;
    const match = stdout.match(/ (?<name>[-\w]+)-permit.json/);
    if (!(match && match.groups)) {
      throw new Error('no permit found');
    }
    const plan = await readJSON(`./${match.groups.name}-plan.json`);
    console.log(plan);

    console.log('copying files to container');

    tools.copyFiles([
      `./${plan.script}`,
      `./${plan.permit}`,
      ...plan.bundles.map(b => b.fileName),
    ]);

    console.log('installing bundles');
    await tools.installBundles(
      plan.bundles.map(b => `/tmp/contracts/${b.bundleID}.json`),
      console.log,
    );

    console.log('executing proposal');
    await tools.runCoreEval({
      name: plan.name,
      description: `${plan.name} proposal`,
    });
  };

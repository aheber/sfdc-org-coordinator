require("dotenv").config();
// const jsforce = require("jsforce");
console.log("Hello world from the director");
// get a database handle
const {
  getCountOfAvailableOrgs,
  getSweepableOrgs,
  getBelievedFailedBuilds,
} = require("../build/dao/org");
const { startOrgBuild, sweepOrg, failOrg } = require("../build/org");

async function run() {
  const desiredPoolSize = process.env.POOL_SIZE;
  // Evaluate completed orgs for sweep jobs
  const sweepableOrgs = await getSweepableOrgs();
  console.log("Sweepable Orgs:", sweepableOrgs);
  for (const org of sweepableOrgs) {
    await sweepOrg(org.id);
  }
  const failedOrgs = await getBelievedFailedBuilds();
  console.log("Failed Builds:", failedOrgs);
  for (const org of failedOrgs) {
    // if we had an org but it wasn't successful, burn the org then mark it as an error
    if (org.username) {
      await sweepOrg(org.id);
    }
    await failOrg(org.id);
  }
  // TODO: cleanup stalled orgs before the 24 hour counter is up
  // evaluate the number of available orgs and the number of building orgs
  const currentOrgStock = await getCountOfAvailableOrgs();
  console.log("Current Orgs:", currentOrgStock);
  console.log("Desired pool size:", desiredPoolSize);
  const currentStock = Object.values(currentOrgStock).reduce((total, val) => {
    return total + val;
  });
  console.log("Current Stock Total:", currentStock);
  if (currentStock < desiredPoolSize) {
    console.log(
      "Current stock is low, should start",
      desiredPoolSize - currentStock,
      "new org builds"
    );
    const org = await startOrgBuild();
    console.log(org);
  } else {
    console.log("Current stock is great, leaving it alone");
  }

  // if we need more, determine the number of recent failures

  // as long as the failure count for the last x number of jobs, capped at 24 hours, isn't too high, then start building more

  //
}
run().catch((error) => {
  console.error(error);
  process.exit(1);
});

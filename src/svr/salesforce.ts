import { getJWTToken } from "salesforce-jwt-promise";
import jsforce from "jsforce";

// const adminUrls = ["lightning/n/Product_Explorer"];
const adminComms = ["E-Bikes"];
// const custComms = ["E-Bikes"];

export const getOrgAccessUrls = async (username: string) => {
  // Use JWT to get an access token to the org
  const jwtResponse = await getJWTToken({
    clientId: process.env.CONNECTED_APP_CONSUMER_KEY as string,
    privateKey: process.env.JWT_KEY as string,
    userName: username,
    audience: "https://test.salesforce.com",
  });

  // build basic login URL using the access token
  const urlBase = `${jwtResponse.instance_url}/secur/frontdoor.jsp?sid=${jwtResponse.access_token}`;

  // get a JSForce connection using the access token
  const conn = new jsforce.Connection({
    instanceUrl: jwtResponse.instance_url,
    accessToken: jwtResponse.access_token,
  });
  const promises = [] as Promise<jsforce.QueryResult<any>>[];
  // get a partner user from the org
  // promises.push(
  //   conn.query(
  //     "SELECT Id, Username from User WHERE IsActive = true AND UserType = 'PowerPartner' LIMIT 1"
  //   )
  // );
  promises.push(conn.query("SELECT Id FROM Organization"));

  // get all of the networks from the org

  promises.push(conn.query("SELECT Id, Name FROM Network"));

  // get the org ID for use in some of the SU URLs
  // const custUser = (await promises[0]).records[0];
  const organization = await promises[0];
  const networks = await promises[1];
  const orgId = (organization.records[0] as any).Id.slice(0, -3);

  // build an object of community URLs that can be used to access the org
  // allowing access directly into specific communities and as the partner user
  const urls = {} as any;
  urls.admin = { comms: {}, urls: {} };
  urls.customer = {};
  urls.admin.core = urlBase;
  (networks.records as any).map((r) => {
    if (adminComms.includes(r.Name)) {
      urls.admin.comms[r.Name] =
        urlBase +
        "&retURL=" +
        encodeURIComponent(
          "/servlet/networks/switch?networkId=" + r.Id.slice(0, -3)
        );
    }
    // if (custComms.includes(r.Name)) {
    //   urls.customer[r.Name] =
    //     urlBase +
    //     "&retURL=" +
    //     encodeURIComponent(
    //       `/servlet/servlet.su?oid=${orgId}&sunetworkid=${r.Id.slice(
    //         0,
    //         -3
    //       )}&sunetworkuserid=${custUser.Id.slice(0, -3)}`
    //     );
    // }
  });
  console.log("URLs", urls);
  return urls;
};

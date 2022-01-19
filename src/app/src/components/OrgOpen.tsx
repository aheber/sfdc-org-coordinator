import { getOrgAccessUrls } from "../Api";
import { useEffect, useState } from "react";
export default function Admin() {
  const [orgUrls, setOrgUrls] = useState(null as any);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("slug")) {
      getOrgAccessUrls(params.get("slug") as string)
        .then(async (orgs) => {
          const json = await orgs.json();
          setOrgUrls(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  if (!orgUrls) {
    return <div></div>;
  }
  return (
    <div className="org-open">
      <div>Open org as admin</div>
      <ul>
        <li>
          <a href={orgUrls.admin.core}>Core - Setup</a>
        </li>
        <li>
          <a
            href={
              orgUrls.admin.core + "&retURL=%2Flightning%2Fn%2FProduct_Explorer"
            }
          >
            Core - E-Bikes
          </a>
        </li>
        <li>
          <a href={orgUrls.admin.comms["E-Bikes"]}>E-Bikes</a>
        </li>
      </ul>
      {/* <div>Open org as customer</div>
      <ul>
        <li>
          <a href={orgUrls.customer["E-Bikes"]}>E-Bikes</a>
        </li>
      </ul> */}
    </div>
  );
}

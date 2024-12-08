// import { cookies } from "next/headers";

// export async function getAuthToken() {
//   const authToken = cookies().get("jwt")?.value;
//   return authToken;
// }

import cookie from "js-cookie";

export async function getAuthToken() {
  const authToken = cookie.get("jwt");
  return authToken;
}

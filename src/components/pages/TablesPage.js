import React, { useState, useEffect } from "react";
import {
  MDBRow,
  MDBCol,
  MDBView,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from "mdbreact";

import {
  BSON,
  Stitch,
  AnonymousCredential,
  FacebookRedirectCredential,
  GoogleRedirectCredential,
  RemoteMongoClient,
  UserPasswordCredential,
  UserPasswordAuthProviderClient
} from "mongodb-stitch-browser-sdk";

/**
 * App Client Initialization - Connect to Stitch!
 */

const APP_ID = "blog-comments-rycnr";
const app = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID);

/**
 * Authentication
 */

// General Authentication Methods & Properties
export async function loginAnonymous() {
  return app.auth.loginWithCredential(new AnonymousCredential());
}
export async function logout() {
  if (app.auth.isLoggedIn) {
    app.auth.logoutUserWithId(app.auth.user.id);
  }
}
export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}
export function getCurrentUser() {
  return app.auth.user;
}

export function addAuthenticationListener(listener) {
  app.auth.addAuthListener(listener);
}
export function removeAuthenticationListener(listener) {
  app.auth.removeAuthListener(listener);
}

// OAuth 2.0 Login Methods
export async function loginFacebook() {
  return await app.auth.loginWithRedirect(new FacebookRedirectCredential());
}
export async function loginGoogle() {
  return await app.auth.loginWithRedirect(new GoogleRedirectCredential());
}
export function handleOAuthRedirects() {
  if (app.auth.hasRedirectResult()) {
    return app.auth.handleRedirectResult();
  }
}

// Email/Password Authentication Methods
export async function loginEmailPassword(email, password) {
  const credential = new UserPasswordCredential(email, password);
  return await app.auth.loginWithCredential(credential);
}
function getEmailPasswordClient() {
  return app.auth.getProviderClient(
    UserPasswordAuthProviderClient.factory,
    "local-userpass"
  );
}
export async function registerEmailPasswordUser(email, password) {
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.registerWithEmail(email, password);
}
export async function resendConfirmationEmail(email) {
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.resendConfirmationEmail(email);
}
export async function confirmEmailPasswordUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const tokenId = urlParams.get("tokenId");
  const emailPasswordAuth = getEmailPasswordClient();
  return await emailPasswordAuth.confirmUser(token, tokenId);
}

/**
 * Our Stuff
 */

// Stitch MongoDB Service Client for our cluster
const mongodb = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);

// Collection that contains blog documents
const comments = mongodb.db("blog").collection("comments");

const myHook = () => {

  // Declare a new state variable, which we'll call "data", the second argument is the function that replaces setState()
  const [data, setData] = useState([]);

  // "useEffect" is similar to componentDidMount, but we have to do our promises inside here
  useEffect(() => {
    comments
      .find({}, { limit: 1000 })
      .toArray()
      .then(list => {
        // since we named our function setData before, this is just like saying setState()
        setData(list);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return data.map(mappedData => {

    return (
      <MDBTableBody key={mappedData._id}>
        <tr>
          <td>{mappedData.owner_id}</td>
          <td>{mappedData.first}</td>
          <td>{mappedData.last}</td>
          <td>{mappedData.comment}</td>
        </tr>
      </MDBTableBody>
    );
  });
};

const TablesPage = () => {
  return (
    <>
      <MDBRow>
        <MDBCol md="12">
          <MDBCard className="mt-5">
            <MDBView className="gradient-card-header blue darken-2">
              <h4 className="h4-responsive text-white">Basic tables</h4>
            </MDBView>
            <MDBCardBody>
              <h3 className="mt-5 text-left">
                <strong>This table is connected to stitch</strong>
              </h3>
              <h2>hello</h2>
              <div />
              <p>
                Using the most basic table markup, here’s how .table-based
                tables look in Bootstrap. All table styles are inherited in
                Bootstrap 4, meaning any nested tables will be styled in the
                same manner as the parent.
              </p>
              <MDBTable>
                <MDBTableHead>
                  <tr>
                    <th>Owner Id</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Comment</th>
                  </tr>
                </MDBTableHead>
                {myHook()}
              </MDBTable>
              <h3 className="mt-5 text-left">
                <strong>MDBTable head options</strong>
              </h3>
              <p>
                To change a background-color of thead (or any other element) use
                our color classes. If you are going to use a dark background you
                should also consider white text (to provide a proper contrast)
                by adding .text-white class.
              </p>
              <MDBTable>
                <MDBTableHead color="primary-color" textWhite>
                  <tr>
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Handle</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </MDBTableBody>
              </MDBTable>
              <MDBTable>
                <MDBTableHead color="pink">
                  <tr>
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Handle</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </MDBTableBody>
              </MDBTable>
              <h3 className="mt-5 text-left">
                <strong>Striped rows.</strong>
              </h3>
              <p>
                Use prop striped to add zebra-striping to any table row within
                the table body
              </p>
              <MDBTable striped>
                <MDBTableHead>
                  <tr>
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Handle</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default TablesPage;

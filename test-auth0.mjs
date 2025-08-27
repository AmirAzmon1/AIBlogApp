// import * as Auth0 from "@auth0/nextjs-auth0";

// console.log(Object.keys(Auth0));
import { handleAuth } from '@auth0/nextjs-auth0';

// הוסף את השורה הזאת כדי שנראה מה באמת מיובא
console.log('Imported from Auth0 library:', { handleAuth });

export default handleAuth();
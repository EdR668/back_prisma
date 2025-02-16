import createHttpError from "http-errors";
import env from "../../utils/validateEnv";
import { RequestHandler } from "express";


const getAuth0ManagementToken = async (): Promise<string> => {
    try {
      const response = await fetch(`https://dev-p3hv1ufn7l6q5x5j.us.auth0.com/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: env.AUTH_CLIENT_ID,
          client_secret: env.AUTH_SECRET_ID,
          audience: "https://dev-p3hv1ufn7l6q5x5j.us.auth0.com/api/v2/",
        }),
      });
  
      if (!response.ok) {
        throw new Error(
          `Failed to obtain Auth0 Management API token. Status: ${response.status}`
        );
      }
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error fetching Auth0 Management API token:", error);
      throw new Error("Could not fetch management token");
    }
  };


export const listRole: RequestHandler = async (req, res, next) => {
    try {
      const managementToken = await getAuth0ManagementToken();

      const response = await fetch(`https://dev-p3hv1ufn7l6q5x5j.us.auth0.com/api/v2/roles`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${managementToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(
          `Failed to obtain Auth0 Management API token. Status: ${response.status}. Response: ${errorResponse}`
        );
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };



  export const assignRole: RequestHandler = async (req, res, next) => {
    try {
      const { userId, roleName } = req.body;
  
      if (!userId || !roleName) {
        throw createHttpError(400, "Missing userId or roleName in request body");
      }
  
      // Obtener el token de la Management API
      const managementToken = await getAuth0ManagementToken();
  
      // Paso 1: Obtener la lista de roles
      const rolesResponse = await fetch(`https://dev-p3hv1ufn7l6q5x5j.us.auth0.com/api/v2/roles`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${managementToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!rolesResponse.ok) {
        throw createHttpError(
          rolesResponse.status,
          `Failed to fetch roles: ${await rolesResponse.text()}`
        );
      }
  
      const rolesData = await rolesResponse.json();
  
      // Paso 2: Buscar el ID del rol basado en roleName
      const role = rolesData.find((r: any) => r.name === roleName);
  
      if (!role) {
        throw createHttpError(404, `Role with name ${roleName} not found`);
      }
  
      const roleId = role.id;
  
      // Paso 3: Asignar el rol al usuario
      const assignResponse = await fetch(
        `https://dev-p3hv1ufn7l6q5x5j.us.auth0.com/api/v2/users/${userId}/roles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${managementToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roles: [roleId] }),
        }
      );
  
      if (!assignResponse.ok) {
        throw createHttpError(
          assignResponse.status,
          `Failed to assign role: ${await assignResponse.text()}`
        );
      }
  
      res.status(200).json({ message: "Role assigned successfully" });
    } catch (error) {
      next(error);
    }
  };
  
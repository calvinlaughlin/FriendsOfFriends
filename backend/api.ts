interface UserData {
    phoneNumber: string;
    firstName: string;
    birthday: string;
    gender: string;
    desiredGender: string;
    profilePhoto: string;
    additionalPhotos: string[];
    promptAnswers: { [key: string]: string };
    location: string;
    college: string | null;
    job: string;
    closestContacts: { name: string; phoneNumber: string }[];
    excludedContacts: { name: string; phoneNumber: string }[];
  }
  
  interface CreatedUser extends UserData {
    _id: string;
  }
  
  export async function createUserInBackend(userData: UserData): Promise<CreatedUser> {
    try {
      console.log("Sending user data to backend:", JSON.stringify(userData, null, 2));
      const response = await fetch("http://localhost:5001/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      console.log("Backend response status:", response.status);
      const responseText = await response.text();
      console.log("Backend response text:", responseText);
  
      if (!response.ok) {
        throw new Error(`Failed to create user in backend: ${response.status} ${responseText}`);
      }
  
      const data = JSON.parse(responseText) as CreatedUser;
      console.log("User created successfully in backend:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error("Error creating user in backend:", error);
      throw error;
    }
  }
  
  // You can add other API-related functions here as well
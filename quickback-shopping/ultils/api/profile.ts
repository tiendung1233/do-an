import { apiCall } from "../func/api";

interface EditProfileResponse {
  success: boolean;
}

export interface IProfile {}

interface MoneyByEvent {
  tree: number;
  wheel: number;
}

interface Tree {
  type: "Cactus" | "Sunflower" | "Lotus" | "Mushroom";
  plantedAt: string;
  lastWateredAt: string;
  waterings: number;
  status: "alive" | "dead";
  _id: string;
}

export interface IProfileResponse {
  moneyByEvent: MoneyByEvent;
  _id: string;
  name: string;
  email: string;
  googleId?: string;
  __v: number;
  password?: string;
  money: number;
  total?: number;
  trees: Tree[];
  updatedAt: string;
  freeSpins: number;
  lastSpinDate: string;
  secretBoxesCollected: number;
  spinStartTime: string;
  spinToken: string;
  accountBank?: string;
  bankName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  inviteCode?: string[];
  image?: string;
  role?: number;
}

export const getProfile = async (token: string): Promise<IProfileResponse> => {
  return apiCall<IProfileResponse>("/api/user", "GET", undefined, token);
};

export const editProfile = async (
  data: any,
  token: string
): Promise<EditProfileResponse> => {
  return apiCall<EditProfileResponse>("/api/user/profile", "PUT", data, token);
};

interface ChangePasswordResponse {
  success: boolean;
}

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  token: string
): Promise<ChangePasswordResponse> => {
  const data = { oldPassword, newPassword };
  return apiCall<ChangePasswordResponse>(
    "/api/user/change-password",
    "PUT",
    data,
    token
  );
};

export const getAllUser = async (token: string): Promise<any> => {
  return apiCall<any>("/api/user/admin-all-user", "GET", undefined, token);
};

export const updateUser = async (
  token: string,
  id: string,
  data: any
): Promise<any> => {
  return apiCall<any>(`/api/user/admin-update-users/${id}`, "PUT", data, token);
};

export const addUser = async (
  token: string,
  data: any
): Promise<any> => {
  return apiCall<any>("/api/user/admin-create-users", "POST", data, token);
};

export const deleteUser = async (token: string, id: string): Promise<any> => {
  return apiCall<any>(`/api/user/admin-del-users/${id}`, "DELETE", undefined, token);
};

export interface ImportUsersResult {
  success: number;
  failed: number;
  errors: { row: number; email: string; reason: string }[];
}

export interface ImportUsersResponse {
  message: string;
  results: ImportUsersResult;
}

export const importUsers = async (
  token: string,
  file: File
): Promise<ImportUsersResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "http://localhost:5001/api/user/admin-import-users",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.json();
};

export const downloadImportTemplate = async (token: string): Promise<void> => {
  const response = await fetch(
    "http://localhost:5001/api/user/admin-import-template",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import_users_template.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};

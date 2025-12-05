"use client";

import InputSection from "@/components/input/input";
import { useToast } from "@/context/toastContext";
import {
  getAllUser,
  updateUser,
  addUser,
  deleteUser,
} from "@/ultils/api/profile";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import {
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const defaultData = {
  name: "",
  email: "",
  accountBank: "",
  bankName: "",
  total: 0,
  phoneNumber: "",
  address: "",
  city: "",
  image: "",
  inviteCode: [],
  money: 0,
};

const fieldLabels: { [key: string]: string } = {
  name: "Họ tên",
  email: "Email",
  accountBank: "Số tài khoản",
  bankName: "Ngân hàng",
  total: "Tổng tiền",
  phoneNumber: "Số điện thoại",
  address: "Địa chỉ",
  city: "Thành phố",
  image: "Ảnh đại diện",
  inviteCode: "Mã giới thiệu",
  money: "Số dư",
};

export default function UserAdmin() {
  const token = Cookies.get("authToken");
  const { addToast } = useToast();
  const [people, setPeople] = useState<any[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(defaultData);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"edit" | "delete" | null>(
    null
  );
  const [modalUserId, setModalUserId] = useState<string | null>(null);

  const checkbox = useRef<any>();

  const fetchUser = async () => {
    const data = await getAllUser(token!);
    if (data) {
      setPeople(data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < people.length;
    setChecked(selectedPeople.length === people.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  const openModal = (action: "edit" | "delete", userId: string) => {
    setModalAction(action);
    setModalUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setModalUserId(null);
  };

  const handleModalConfirm = async () => {
    if (modalAction === "delete" && modalUserId) {
      await handleDelete(modalUserId);
    } else if (modalAction === "edit" && modalUserId) {
      const user = people.find((person) => person._id === modalUserId);
      if (user) handleEdit(user);
    }
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      addToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }
    if (editingUser) {
      const res = await updateUser(token!, editingUser._id, formData);
      if (res?.message?.includes("success")) {
        addToast("Cập nhật người dùng thành công", "success");
      }
    } else {
      const res = await addUser(token!, formData);
      if (res?.message?.includes("success")) {
        addToast("Thêm người dùng thành công", "success");
      }
    }
    fetchUser();
    setEditingUser(null);
    setFormData(defaultData);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUser(token!, id);
    if (res?.message?.includes("success")) {
      addToast("Xóa người dùng thành công", "success");
    }
    fetchUser();
  };

  const handleEdit = (person: any) => {
    const {
      moneyByEvent,
      _id,
      __v,
      googleId,
      trees,
      isVerified,
      role,
      inviteCode,
      ...rest
    } = person;
    setEditingUser(person);
    const restData = rest;
    const data = { ...defaultData, ...restData };
    setFormData(data);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-500 shadow-primary-sm">
            <UserPlusIcon className="size-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(formData)?.map((key) => (
              <div className="text-left" key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5"
                >
                  {fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <InputSection
                  id={key}
                  type={key === "isVerified" ? "checkbox" : "text"}
                  value={formData[key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  styleInput={
                    { width: key === "isVerified" ? "auto" : "100%" } as any
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-primary-sm hover:shadow-primary transition-all"
            >
              {editingUser ? (
                <>
                  <PencilSquareIcon className="size-5" />
                  Cập nhật
                </>
              ) : (
                <>
                  <UserPlusIcon className="size-5" />
                  Thêm mới
                </>
              )}
            </button>
            {editingUser && (
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormData(defaultData);
                }}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-secondary-900/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 border border-secondary-200/50 dark:border-secondary-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${
                  modalAction === "delete"
                    ? "bg-error-500"
                    : "bg-primary-500"
                }`}
              >
                {modalAction === "delete" ? (
                  <TrashIcon className="size-5 text-white" />
                ) : (
                  <PencilSquareIcon className="size-5 text-white" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {modalAction === "delete" ? "Xác nhận xóa" : "Xác nhận sửa"}
              </h2>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              {modalAction === "delete"
                ? "Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
                : "Bạn có chắc chắn muốn chỉnh sửa thông tin người dùng này không?"}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleModalConfirm}
                className={`px-4 py-2.5 rounded-xl font-medium text-white transition-colors ${
                  modalAction === "delete"
                    ? "bg-error-500 hover:bg-error-600"
                    : "bg-primary-500 hover:bg-primary-600"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex size-10 items-center justify-center rounded-xl bg-success-500 shadow-lg">
            <UsersIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Danh sách người dùng
            </h2>
            <p className="text-sm text-secondary-500">
              Tổng cộng {people?.length || 0} người dùng
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary-50/50 dark:bg-secondary-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider min-w-[200px]">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider min-w-[80px]">
                  Ảnh
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Đã rút
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Số dư
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Ngân hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  STK
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Sự kiện
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  SĐT
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Xác thực
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700/50">
              {people &&
                people?.length > 0 &&
                people?.map((person) => (
                  <tr
                    key={person._id}
                    className="hover:bg-secondary-50/50 dark:hover:bg-secondary-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 font-mono">
                      {person._id?.slice(-8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-secondary-900 dark:text-white">
                        {person.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {person.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={person.image || "/img_no_img.jpg"}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                      {formatMoney(person.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600 dark:text-success-400">
                      {formatMoney(person.money)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {person.bankName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {person.accountBank || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-warning-600 dark:text-warning-400">
                      {formatMoney(
                        person.moneyByEvent?.tree + person.moneyByEvent?.wheel || 0
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                      {person.phoneNumber || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {person.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-xs font-medium">
                          <CheckCircleIcon className="size-4" />
                          Đã xác thực
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-xs font-medium">
                          <XCircleIcon className="size-4" />
                          Chưa xác thực
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(person)}
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                          title="Sửa"
                        >
                          <PencilSquareIcon className="size-5" />
                        </button>
                        {person?.role < 2 && (
                          <button
                            onClick={() => openModal("delete", person._id)}
                            className="p-2 rounded-lg text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                            title="Xóa"
                          >
                            <TrashIcon className="size-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

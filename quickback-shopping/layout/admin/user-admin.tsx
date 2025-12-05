"use client";

import InputSection from "@/components/input/input";
import { useToast } from "@/context/toastContext";
import {
  getAllUser,
  updateUser,
  addUser,
  deleteUser,
  importUsers,
  downloadImportTemplate,
  ImportUsersResult,
} from "@/ultils/api/profile";
import Cookies from "js-cookie";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
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
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>(defaultData);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"edit" | "delete" | "bulk-delete" | null>(null);
  const [modalUserId, setModalUserId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportUsersResult | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [deleting, setDeleting] = useState(false);

  const checkbox = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUser = async () => {
    const data = await getAllUser(token!);
    if (data) {
      setPeople(data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Filter users by email search
  const filteredPeople = useMemo(() => {
    if (!searchEmail.trim()) return people;
    return people.filter((person) =>
      person.email?.toLowerCase().includes(searchEmail.toLowerCase())
    );
  }, [people, searchEmail]);

  // Handle select all checkbox
  useEffect(() => {
    if (checkbox.current) {
      const selectableUsers = filteredPeople.filter((p) => p.role < 2);
      const isAllSelected = selectableUsers.length > 0 && selectedPeople.length === selectableUsers.length;
      const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < selectableUsers.length;
      checkbox.current.checked = isAllSelected;
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople, filteredPeople]);

  const toggleSelectAll = () => {
    const selectableUsers = filteredPeople.filter((p) => p.role < 2);
    if (selectedPeople.length === selectableUsers.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(selectableUsers.map((p) => p._id));
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedPeople((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const openModal = (action: "edit" | "delete" | "bulk-delete", userId?: string) => {
    setModalAction(action);
    setModalUserId(userId || null);
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
    } else if (modalAction === "bulk-delete") {
      await handleBulkDelete();
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
    setSelectedPeople((prev) => prev.filter((pid) => pid !== id));
  };

  const handleBulkDelete = async () => {
    if (selectedPeople.length === 0) return;

    setDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const userId of selectedPeople) {
      try {
        const res = await deleteUser(token!, userId);
        if (res?.message?.includes("success")) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setDeleting(false);

    if (successCount > 0) {
      addToast(`Đã xóa ${successCount} người dùng`, "success");
    }
    if (failCount > 0) {
      addToast(`${failCount} người dùng không thể xóa`, "error");
    }

    setSelectedPeople([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      if (!allowedTypes.includes(file.type)) {
        addToast("Chỉ hỗ trợ file CSV hoặc Excel (.xlsx, .xls)", "error");
        return;
      }
      setImportFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!importFile || !token) return;

    setImporting(true);
    try {
      const response = await importUsers(token, importFile);
      setImportResult(response.results);
      if (response.results.success > 0) {
        addToast(`Import thành công ${response.results.success} người dùng`, "success");
        fetchUser();
      }
      if (response.results.failed > 0) {
        addToast(`${response.results.failed} dòng bị lỗi`, "error");
      }
    } catch (error) {
      addToast("Có lỗi xảy ra khi import", "error");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    if (!token) return;
    try {
      await downloadImportTemplate(token);
      addToast("Đã tải file mẫu", "success");
    } catch (error) {
      addToast("Có lỗi xảy ra khi tải file mẫu", "error");
    }
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

          <div className="flex flex-wrap gap-3 mt-6">
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
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowUpTrayIcon className="size-5" />
              Import từ file
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Modal - Fixed position */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-6 max-w-md w-full border border-secondary-200/50 dark:border-secondary-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${
                    modalAction === "delete" || modalAction === "bulk-delete"
                      ? "bg-error-500"
                      : "bg-primary-500"
                  }`}
                >
                  {modalAction === "delete" || modalAction === "bulk-delete" ? (
                    <TrashIcon className="size-5 text-white" />
                  ) : (
                    <PencilSquareIcon className="size-5 text-white" />
                  )}
                </div>
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  {modalAction === "bulk-delete"
                    ? "Xác nhận xóa hàng loạt"
                    : modalAction === "delete"
                    ? "Xác nhận xóa"
                    : "Xác nhận sửa"}
                </h2>
              </div>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {modalAction === "bulk-delete"
                  ? `Bạn có chắc chắn muốn xóa ${selectedPeople.length} người dùng đã chọn? Hành động này không thể hoàn tác.`
                  : modalAction === "delete"
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
                  disabled={deleting}
                  className={`px-4 py-2.5 rounded-xl font-medium text-white transition-colors inline-flex items-center gap-2 ${
                    modalAction === "delete" || modalAction === "bulk-delete"
                      ? "bg-error-500 hover:bg-error-600"
                      : "bg-primary-500 hover:bg-primary-600"
                  } disabled:opacity-50`}
                >
                  {deleting ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal - Fixed position */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm"
              onClick={closeImportModal}
            />
            <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-6 max-w-lg w-full border border-secondary-200/50 dark:border-secondary-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-success-500">
                  <ArrowUpTrayIcon className="size-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Import người dùng từ file
                </h2>
              </div>

              <div className="space-y-4">
                {/* Download Template */}
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                  <div className="flex items-start gap-3">
                    <DocumentTextIcon className="size-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                        Tải file mẫu
                      </p>
                      <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                        Tải file Excel mẫu để biết định dạng dữ liệu cần import
                      </p>
                      <button
                        onClick={handleDownloadTemplate}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <ArrowDownTrayIcon className="size-4" />
                        Tải file mẫu (.xlsx)
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Chọn file để import
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-secondary-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100
                      dark:file:bg-primary-900/30 dark:file:text-primary-400
                      cursor-pointer"
                  />
                  {importFile && (
                    <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                      Đã chọn: <span className="font-medium">{importFile.name}</span>
                    </p>
                  )}
                </div>

                {/* Import Result */}
                {importResult && (
                  <div className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
                    <h4 className="text-sm font-medium text-secondary-900 dark:text-white mb-3">
                      Kết quả import
                    </h4>
                    <div className="flex gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="size-5 text-success-500" />
                        <span className="text-sm text-secondary-700 dark:text-secondary-300">
                          Thành công: <span className="font-semibold text-success-600">{importResult.success}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="size-5 text-error-500" />
                        <span className="text-sm text-secondary-700 dark:text-secondary-300">
                          Thất bại: <span className="font-semibold text-error-600">{importResult.failed}</span>
                        </span>
                      </div>
                    </div>

                    {importResult.errors.length > 0 && (
                      <div className="max-h-40 overflow-y-auto">
                        <p className="text-xs font-medium text-secondary-500 mb-2">Chi tiết lỗi:</p>
                        <div className="space-y-1">
                          {importResult.errors.map((error, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-xs p-2 rounded-lg bg-error-50 dark:bg-error-900/20"
                            >
                              <ExclamationTriangleIcon className="size-4 text-error-500 flex-shrink-0 mt-0.5" />
                              <span className="text-error-700 dark:text-error-400">
                                Dòng {error.row}: {error.email} - {error.reason}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeImportModal}
                  className="px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || importing}
                  className="px-4 py-2.5 rounded-xl font-medium text-white bg-success-500 hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                >
                  {importing ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang import...
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="size-4" />
                      Import
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-success-500 shadow-lg">
              <UsersIcon className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Danh sách người dùng
              </h2>
              <p className="text-sm text-secondary-500">
                {searchEmail
                  ? `Tìm thấy ${filteredPeople.length} / ${people.length} người dùng`
                  : `Tổng cộng ${people?.length || 0} người dùng`}
              </p>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Tìm theo email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl bg-secondary-100 dark:bg-secondary-700 border-0 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>

            {/* Bulk Delete Button */}
            {selectedPeople.length > 0 && (
              <button
                onClick={() => openModal("bulk-delete")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-error-500 text-white font-medium hover:bg-error-600 transition-colors"
              >
                <TrashIcon className="size-5" />
                Xóa {selectedPeople.length} đã chọn
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary-50/50 dark:bg-secondary-900/50">
                <th className="px-6 py-4 text-left">
                  <input
                    ref={checkbox}
                    type="checkbox"
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
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
              {filteredPeople &&
                filteredPeople.length > 0 &&
                filteredPeople.map((person) => (
                  <tr
                    key={person._id}
                    className={classNames(
                      "hover:bg-secondary-50/50 dark:hover:bg-secondary-700/30 transition-colors",
                      selectedPeople.includes(person._id)
                        ? "bg-primary-50/50 dark:bg-primary-900/20"
                        : ""
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {person.role < 2 && (
                        <input
                          type="checkbox"
                          checked={selectedPeople.includes(person._id)}
                          onChange={() => toggleSelectUser(person._id)}
                          className="size-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                      )}
                    </td>
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

          {/* Empty State */}
          {filteredPeople.length === 0 && (
            <div className="py-12 text-center">
              <UsersIcon className="mx-auto size-12 text-secondary-300" />
              <p className="mt-4 text-secondary-500">
                {searchEmail
                  ? `Không tìm thấy người dùng với email "${searchEmail}"`
                  : "Chưa có người dùng nào"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

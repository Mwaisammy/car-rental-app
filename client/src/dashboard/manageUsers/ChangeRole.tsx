import * as yup from "yup";
import { usersAPI, type TUser } from "../../Features/user/userAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";

type ChangeRoleProps = {
  user: TUser | null;
};

type ChangeRoleInputs = {
  role: "user" | "admin";
};

const schema = yup.object({
  role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

const ChangeRole = ({ user }: ChangeRoleProps) => {
  const [updateUser, { isLoading }] = usersAPI.useUpdateUserMutation({
    fixedCacheKey: "updateUser",
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ChangeRoleInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue("role", user.role as "user" | "admin"); // Set the role based on the user object
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit: SubmitHandler<ChangeRoleInputs> = async (data) => {
    try {
      if (!user) {
        toast.error("No user selected for role change");
        return;
      }
      await updateUser({ id: user.customerID, role: data.role });

      toast.success("Role updated successfully");
      reset();
      (document.getElementById("role_modal") as HTMLDialogElement).close();
    } catch (error) {
      console.log(error);
      toast.error("Failed to change role");
    }
  };

  return (
    <dialog id="role_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-900 border-1 border-blue-500 text-white rounded-sm w-full max-w-xs sm:max-w-lg shadow-2xl">
        <h3 className="font-bold text-lg mb-4">Change role</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-flex-col gap-4">
          <label>
            <select
              {...register("role")}
              className="select select-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {errors.role && (
              <span className="text-sm text-red-700">
                {errors.role.message}
              </span>
            )}

            <div className="modal-action flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="btn btn-primary  border-2 border-blue-500 w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner text-primary" />{" "}
                    Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </button>
              <button
                className="btn w-full sm:w-auto"
                type="button"
                onClick={() => {
                  (
                    document.getElementById("role_modal") as HTMLDialogElement
                  )?.close();
                  reset();
                }}
              >
                Cancel
              </button>
            </div>
          </label>
        </form>
      </div>
    </dialog>
  );
};

export default ChangeRole;

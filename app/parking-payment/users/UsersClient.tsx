'use client';
import withPermission from "@/app/withPermission";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Input, Select, SelectItem, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { GridColDef } from "@mui/x-data-grid";
import { useState, useEffect, useMemo } from "react";
import User, { initialUserEdit, Rol } from "@/types/User";
import CustomDataGrid from "@/components/customDataGrid";
import { PencilIcon, LargeEyeIcon } from "@/components/icons";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserSchema, editUserSchema } from "@/app/schemas/validationSchemas";
import MessageError from "@/components/menssageError";
import { AxiosError } from "axios";
import { title } from "@/components/primitives";
import UseUsers from "@/app/hooks/users/UseUsers";
import { useRouter, useSearchParams } from "next/navigation";
import { ActionTooltips, CustomTooltip } from "@/components/customTooltip";
import { createUserAction, getUserByIdAction, getUsersAction, updateUserAction } from "@/actions/users";
import UsePermissions from "@/app/hooks/UsePermissions";
import { TablePagination } from "@/components/Pagination";
import Loading from "@/app/loading";

interface UsersClientProps {
  users: User[];
  roles: Rol[];
  existingUsernames: string[];
  existingUserEmails: string[];
  pages: number;
}

interface EditUserData {
  username: string;
  email: string;
  realm: string;
  name: string;
  lastName: string;
}



function UsersClient({ users, roles, existingUserEmails, existingUsernames, pages }: UsersClientProps) {

  const { hasPermission, permissions, isLoading } = UsePermissions();
  console.log("hasPermission:", permissions); // Agrega esta línea para verificar el valor de hasPermission en la consola

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenExitoModal,
    onOpen: onOpenExitoModal,
    onOpenChange: onOpenChangeExitoModal,
    onClose: onCloseExitoModal,
  } = useDisclosure();


  const [userEdit, setUserEdit] = useState<User>(initialUserEdit);
  const [isView, setIsView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const canEditUser = useMemo(() => hasPermission(9), [hasPermission]);
  const canSeeUser = useMemo(() => hasPermission(10), [hasPermission]);

  const searchParams = useSearchParams()

  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(pageParam);

  // sincroniza cuando cambia en la URL
  useEffect(() => {
    const newPage = parseInt(searchParams.get("page") || "1");
    setCurrentPage(newPage);
  }, [searchParams]);

  // función para paginación
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/parking-payment/users?${params.toString()}`);
  };

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<EditUserData>({
    resolver: zodResolver(
      editUserSchema(
        existingUsernames,
        existingUserEmails,
        userEdit.username,
        userEdit.email
      )
    ),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserSchema(existingUsernames, existingUserEmails)), // Ajuste según sea necesario
  });


  const router = useRouter()

  const onSubmit = async (data: any) => {
    setLoading(true);
    const toastId = toast.loading("Guardando cambios...");
    try {
      await createUserAction(data);
      console.log("Usuario creado exitosamente:", data);
      router.refresh()
      toast.success("Usuario creado con éxito", {
        id: toastId,
      });
      onClose()
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error("Error al crear el usuario", {
          id: toastId,
        });
      } else {
        console.error("Error desconocido:", error);
        toast.error("Ocurrió un error desconocido. Inténtalo de nuevo.", {
          id: toastId,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const onEditSubmit = async (data: any) => {
    setLoading(true);
    const toastId = toast.loading("Guardando cambios...");
    try {
      console.log("Editando usuario con datos:", data);
      const updatedUser = { ...userEdit, ...data, eliminated: isSelected };

      await updateUserAction(updatedUser);
      console.log("Usuario actualizado exitosamente:", data);
      toast.success("Usuario actualizado con éxito", {
        id: toastId,
      });
      onCloseEdit();
      router.refresh()
    } catch (error) {
      console.error("Error desconocidi:", error);
      toast.error("Ocurrió un error desconocido. Inténtalo de nuevo.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleButtonClick = async (data: User, isViewMode: boolean = false) => {
    try {
      const userData = await getUserByIdAction(data.id.toString());
      setUserEdit(userData);
      editReset({
        username: userData.username,
        email: userData.email,
        realm: userData.realm,
        name: userData.name,
        lastName: userData.lastName,
      });
      setIsSelected(userData.eliminated);
      setIsView(isViewMode);
      onOpenEdit();
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      toast.error("Error al cargar los datos del usuario");
    }
  };


  return !isLoading && (
    <section className="relative flex-col overflow-hidden h-full">
      {loading && <Loading />}{" "}
      <div className="flex flex-col my-3 gap-4 justify-center h-min flex-wrap md:flex-nowrap">
        <h1 className={title()}>Usuarios</h1>
        <div className="flex justify-end">
          <Button
            className="px-3 py-2 text-base max-w-xs"
            color="primary"
            onPress={onOpen}
          >
            Agregar usuario
          </Button>
        </div>
      </div>
      <Table
        aria-label="Tabla de ingresos"
        shadow="none"
        selectionMode="none"
        color="secondary"
        classNames={{
          wrapper: "min-h-[530px] max-h-[530px] overfow-y-auto",
          td: "h-14",
        }}
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn key="name" align="center">
            Nombre
          </TableColumn>
          <TableColumn key="lastName" align="center">
            Apellido
          </TableColumn>
          <TableColumn key="username" align="center">
            Usuario
          </TableColumn>
          <TableColumn key="email" align="center">
            Email
          </TableColumn>
          <TableColumn key="realm" align="center">
            Perfil
          </TableColumn>
          <TableColumn key="eliminated" align="center">
            Estado
          </TableColumn>
          <TableColumn key="actions" align="center">
            Acciones
          </TableColumn>
        </TableHeader>
        <TableBody items={users} emptyContent="No hay registros disponibles">
          {(item: User) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.lastName}</TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.realm}</TableCell>
              <TableCell>{item.eliminated ? "Eliminado" : "Activo"}</TableCell>
              <TableCell>
                <div className="flex h-full justify-center items-center w-full overflow-hidden">
                  <Button
                    className="w-1 h-full p-1 flex items-center"
                    color="default"
                    variant="light"
                    isDisabled={!canEditUser}
                    onPress={() => handleButtonClick(item)}
                  >
                    <PencilIcon size={24} />
                  </Button>

                  <Button
                    className="w-1 h-full p-1 flex items-center"
                    color="default"
                    variant="light"
                    isDisabled={!canSeeUser}
                    onPress={() => handleButtonClick(item, true)}
                  >
                    <LargeEyeIcon size={24} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center my-6">
        <TablePagination
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal
        aria-describedby="user-modal-description"
        aria-labelledby="user-modal-title"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-0">
              <ModalHeader className="flex justify-between w-full pb-0">
                <h1 className={"text-2xl ${title()}"}>
                  Información De Usuario
                </h1>
              </ModalHeader>

              <ModalBody className="flex w-full mt-2">
                <hr className="separator mt-0 mb-2 w-full" />
                <form
                  className="flex flex-col justify-around h-full"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex-grow" />
                  <div className="flex flex-col items-start w-98 ">
                    <div className="flex flex-col mt-2 w-96">
                      <div className="flex items-center mt-2 w-full">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Usuario
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Digita el usuario"
                          type="text"
                          variant="bordered"
                          {...register("username")}
                        />
                      </div>
                      {errors.username && (
                        <MessageError message={errors.username.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Contraseña
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Digita la contraeña"
                          type="password"
                          variant="bordered"
                          {...register("password")}
                        />
                      </div>
                      {errors.password && (
                        <MessageError message={errors.password.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Email
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Digita el email"
                          type="email"
                          variant="bordered"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <MessageError message={errors.email.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Nombre
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Digita el nombre"
                          type="text"
                          variant="bordered"
                          {...register("name")}
                        />
                      </div>
                      {errors.name && (
                        <MessageError message={errors.name.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Apellido
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Digita el apellido"
                          type="text"
                          variant="bordered"
                          {...register("lastName")}
                        />
                      </div>
                      {errors.lastName && (
                        <MessageError message={errors.lastName.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Celular
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Digita el número celular"
                          type="text"
                          variant="bordered"
                          {...register("cellPhoneNumber")}
                        />
                      </div>
                      {errors.cellPhoneNumber && (
                        <MessageError
                          message={errors.cellPhoneNumber.message}
                        />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Perfil
                        </label>

                        <Select
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Selecciona  el rol"
                          variant="bordered"
                          {...register("realm")}
                          onChange={(e) => setValue("realm", e.target.value)}
                        >
                          {roles.length > 0 ? (
                            roles.map((rol) => (
                              <SelectItem key={rol.name} value={rol.name}>
                                {rol.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="cargando" value="">
                              Cargando roles...
                            </SelectItem>
                          )}
                        </Select>
                      </div>
                      {errors.realm && (
                        <MessageError message={errors.realm.message} />
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-center w-96 mt-4 ">
                      <Button variant="ghost" color="primary" type="submit">
                        Guardar datos
                      </Button>
                    </div>
                  </div>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
      <Modal
        className="p-6 m-8"
        aria-describedby="user-modal-description"
        aria-labelledby="user-modal-title"
        isOpen={isOpenEdit}
        onOpenChange={onOpenChangeEdit}
      >
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-4">
              <ModalHeader className="flex justify-between w-full p-0">
                <h1 className="text-center text-2xl font-bold mb-2">
                  Editar Usuario
                </h1>
              </ModalHeader>
              <ModalBody className="flex w-full p-0">
                <hr className="separator mt-0 mb-6 w-full" />
                <form
                  className="flex flex-col space-y-6" //
                  onSubmit={handleEditSubmit(onEditSubmit)}
                >
                  {/* Campos para editar usuario */}
                  <div className="flex flex-col w-full">
                    {/* Campo Nombre */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Nombre</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digita el nombre"
                          type="text"
                          variant="bordered"
                          {...editRegister("name")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.name && (
                            <MessageError message={editErrors.name.message} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Apellido */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">
                        Apellido
                      </label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digita el apellido"
                          type="text"
                          variant="bordered"
                          {...editRegister("lastName")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.lastName && (
                            <MessageError
                              message={editErrors.lastName.message}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Usuario */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Usuario</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digita el usuario"
                          type="text"
                          variant="bordered"
                          {...editRegister("username")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.username && (
                            <MessageError
                              message={editErrors.username.message}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Email */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Email</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digita el email"
                          type="email"
                          variant="bordered"
                          {...editRegister("email")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.email && (
                            <MessageError message={editErrors.email.message} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Perfil */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Perfil</label>
                      <div className="flex flex-col w-2/3">
                        <Select
                          className="w-full"
                          isDisabled={isView}
                          placeholder="Selecciona  el Rol"
                          variant="bordered"
                          {...editRegister("realm")}
                        >
                          {roles.length > 0 ? (
                            roles.map((rol) => (
                              <SelectItem key={rol.name} value={rol.name}>
                                {rol.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="cargando" value="">
                              Cargando roles...
                            </SelectItem>
                          )}
                        </Select>
                        <div className="h-6 mt-1">
                          {editErrors.realm && (
                            <MessageError message={editErrors.realm.message} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Estado */}
                    {hasPermission(11) && (
                      <div className="flex items-center w-full">
                        <label className="text-lg font-bold w-1/3">
                          Estado
                        </label>
                        <div className="w-2/3 mb-6">
                          <Switch
                            className="w-full"
                            isSelected={!userEdit.eliminated}
                            onValueChange={(value) =>
                              setUserEdit((prev) => ({
                                ...prev,
                                eliminated: !value,
                              }))
                            }
                          >
                            <p className="text-sm text-default-500">
                              {userEdit.eliminated ? "Inactivo" : "Activo"}
                            </p>
                          </Switch>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botón de guardar */}
                  <div className="flex justify-center">
                    <Button variant="ghost" color="primary" type="submit">
                      Guardar datos
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

export default withPermission(UsersClient, 1);

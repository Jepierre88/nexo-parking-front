"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    GridLegacy as Grid,
    Modal,
    TextField,
    Box,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { CONSTANTS } from "@/config/constants";
import withPermission from "@/app/withPermission";
import Cookies from "js-cookie";
import { Input } from "@nextui-org/react";
import { TextFields, TextFieldsOutlined, TextFieldsRounded } from "@mui/icons-material";

function AsignacionDescuentos() {
    const [zoneId, setZoneId] = useState<number | null>(null);
    const [usedDiscounts, setUsedDiscounts] = useState(0);
    const [descuentosData, setDescuentosData] = useState({
        code: "",
        creationDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        startDatetime: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        endDatetime: moment().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        isValid: true,
        createdBy: "",
        status: 0,
    });
    const [zonesData, setZonesData] = useState({ quantityDiscounts: 0, usedDiscounts: 0 });
    const disponibles = zonesData.quantityDiscounts - zonesData.usedDiscounts;
    const [okModal, setOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const token = Cookies.get("access_token");

    useEffect(() => {
        // validateLogin();
    }, []);

    useEffect(() => {
        if (zoneId !== null) getData();
    }, [zoneId]);

    async function validateLogin() {
        try {
            const sesionValidation = await axios.get(`${CONSTANTS.APIURL}/users/whoami`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userId = sesionValidation.data;
            const responseData = await axios.get(`${CONSTANTS.APIURL}/users/${userId}`);
            if (responseData.data.realm === "Consultorio") {
                const userFullName = responseData.data.name;
                setDescuentosData((prev) => ({ ...prev, createdBy: userFullName || "" }));
                setZoneId(responseData.data.zoneId);
            } else {
                // window.location.href = "/auth/login";
                setModalMessage("No tienes permisos para acceder a esta páginaasssdasdas");
                setOkModal(true);
            }
        } catch {
            // window.location.href = "/auth/login";
            setModalMessage("No tienes permisos para acceder a esta página");
            setOkModal(true);
        }
    }

    async function getData() {
        try {
            const res = await axios.get(`${CONSTANTS.APIURL}/zones`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const myZone = res.data.find((zone: any) => zone.id === zoneId);
            setZonesData({
                quantityDiscounts: myZone.quantityDiscounts,
                usedDiscounts: myZone.usedDiscounts,
            });
            setUsedDiscounts(myZone.usedDiscounts);
        } catch (err) {
            console.error("Error al obtener zona:", err);
        }
    }

    async function crearDescuento() {
        if (descuentosData.code.length < 4) {
            setModalMessage("El código debe tener al menos 4 dígitos");
            setOkModal(true);
            return;
        }
        if (disponibles <= 0) {
            setModalMessage("No hay descuentos disponibles en este consultorio");
            setOkModal(true);
            return;
        }
        try {
            await axios.post(`${CONSTANTS.APIURL}/discounts`, descuentosData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await axios.patch(`${CONSTANTS.APIURL}/zones/${zoneId}`, {
                usedDiscounts: usedDiscounts + 1,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModalMessage("Descuento asignado exitosamente");
            setOkModal(true);
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            console.error("Error creando descuento:", err);
            setModalMessage("Ocurrió un error al asignar el descuento");
            setOkModal(true);
        }
    }

    return (
        <Box sx={{ p: 4 }}>
            <Card sx={{ maxWidth: 800, mx: "auto" }}>
                <h1 className="font-bold text-2xl text-center p-2">Asignación de descuentos</h1>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <label className=" block font-sans text-left text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2 ">
                                Por favor digite la cédula asociada al descuento:
                            </label>
                            <Input
                                fullWidth
                                className="w-2/3"
                                placeholder="Cédula"
                                size="lg"
                                type="text"
                                variant="bordered"
                                value={descuentosData.code}
                                onChange={(e) =>
                                    setDescuentosData({ ...descuentosData, code: e.target.value })
                                }
                                disabled={disponibles <= 0}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Este código será válido solo una vez durante el día asignado
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" align="center">
                                Descuentos disponibles:
                            </Typography>
                            <Typography variant="h3" align="center" color="primary">
                                {disponibles}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                        {/* <Button variant="outlined" color="secondary" onClick={() => window.location.reload()}>
                            Cancelar
                        </Button> */}
                        <Button variant="contained" color="primary" size="medium" className="w-full" onClick={crearDescuento} style={{ width: "240px" }}>
                            Guardar
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Modal open={okModal} onClose={() => setOkModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" color="success.main">
                        {modalMessage}
                    </Typography>
                    <Button sx={{ mt: 2 }} variant="contained" onClick={() => setOkModal(false)}>
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

const AsignacionDescuentosClient = withPermission(AsignacionDescuentos, 44);
export default AsignacionDescuentosClient;

// Vista 3 adaptada: HistoricoDescuentosClient con estilos NextUI y tailwind
"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Input,
    DateRangePicker,
    Button,
} from "@nextui-org/react";
import { parseAbsoluteToLocal, getLocalTimeZone } from "@internationalized/date";
import moment from "moment";
import axios from "axios";
import withPermission from "@/app/withPermission";
import { toast } from "sonner";

function HistoricoDescuentosClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [data, setData] = useState([]);
    const [code, setCode] = useState(searchParams.get("code") ?? "");
    const [createdBy, setCreatedBy] = useState(searchParams.get("createdBy") ?? "");
    const [filterDateRange, setFilterDateRange] = useState<any>({
        start: searchParams.get("from")
            ? parseAbsoluteToLocal(new Date(searchParams.get("from")!).toISOString())
            : parseAbsoluteToLocal(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()),
        end: searchParams.get("to")
            ? parseAbsoluteToLocal(new Date(searchParams.get("to")!).toISOString())
            : parseAbsoluteToLocal(new Date().toISOString()),
    });

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (code) params.set("code", code);
        else params.delete("code");
        if (createdBy) params.set("createdBy", createdBy);
        else params.delete("createdBy");
        if (filterDateRange.start)
            params.set("from", filterDateRange.start.toDate(getLocalTimeZone()).toISOString());
        if (filterDateRange.end)
            params.set("to", filterDateRange.end.toDate(getLocalTimeZone()).toISOString());

        startTransition(() => {
            router.push(`/discounts/historico?${params.toString()}`);
        });
    };

    // const getData = async () => {
    //     const filter: any = {
    //         where: {
    //             and: [
    //                 { startDatetime: { gte: moment(filterDateRange.start.toDate(getLocalTimeZone())).toISOString() } },
    //                 { endDatetime: { lte: moment(filterDateRange.end.toDate(getLocalTimeZone())).toISOString() } },
    //             ],
    //         },
    //         order: ["id DESC"],
    //     };
    //     if (code) filter.where.and.push({ code: { like: `%${code}%` } });
    //     if (createdBy) filter.where.and.push({ createdBy: { like: `%${createdBy}%` } });

    //     try {
    //         const res = await axios.get("/discounts", {
    //             params: { filter: JSON.stringify(filter) },
    //         });
    //         setData(res.data);
    //     } catch (err) {
    //         console.error("Error al obtener descuentos:", err);
    //         toast.error("Error al cargar datos del historial");
    //     }
    // };

    // useEffect(() => {
    //     getData();
    // }, []);

    return (
        <section className="h-full p-4">
            <h1 className="text-4xl font-bold mb-4">Histórico de Descuentos</h1>

            <div className="flex flex-wrap gap-4 mb-4 items-end">
                <DateRangePicker
                    lang="es-ES"
                    hideTimeZone
                    label="Rango de Fechas"
                    size="md"
                    value={filterDateRange}
                    onChange={setFilterDateRange}
                    classNames={{ inputWrapper: "border border-primary" }}
                />
                <Input
                    label="Cédula"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    classNames={{ inputWrapper: "border border-primary" }}
                />
                <Input
                    label="Agregado por"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    classNames={{ inputWrapper: "border border-primary" }}
                />
                <Button
                    className="bg-primary text-white"
                    variant="shadow"
                    onPress={handleFilter}
                >
                    Filtrar
                </Button>
            </div>

            <div className="w-full overflow-auto">
                <Table
                    aria-label="Tabla de históricos"
                    shadow="none"
                    isHeaderSticky
                    color="primary"
                    classNames={{ wrapper: "min-h-[300px]" }}
                >
                    <TableHeader>
                        <TableColumn>Id</TableColumn>
                        <TableColumn>Cédula</TableColumn>
                        <TableColumn>Estado</TableColumn>
                        <TableColumn>Válido hasta</TableColumn>
                        <TableColumn>Agregado por</TableColumn>
                        <TableColumn>Fecha de asignación</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={data}
                        emptyContent="No hay registros disponibles"
                        isLoading={isPending}
                        loadingContent={<Spinner label="Cargando historial..." />}
                    >
                        {(item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.isValid ? "Sin usar" : "Usado"}</TableCell>
                                <TableCell>{moment(item.endDatetime).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                <TableCell>{item.createdBy}</TableCell>
                                <TableCell>{moment(item.creationDate).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}

export default withPermission(HistoricoDescuentosClient, 45);

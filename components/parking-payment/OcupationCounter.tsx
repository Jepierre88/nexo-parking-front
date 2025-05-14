'use client'
import { Card, CardBody } from "@nextui-org/react";

export default function OcupationCounter() {
    return (
        <article className="absolute z-20 bottom-0 flex flex-col items-center flex-1 w-full">
            <header>
                <h2>Monitoreo de ocupación</h2>
            </header>
            <div className="flex flex-row gap-12 justify-center">
                <Card>
                    <CardBody>
                        Carros
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        Motos
                    </CardBody>
                </Card>
            </div>
        </article>
    )
}
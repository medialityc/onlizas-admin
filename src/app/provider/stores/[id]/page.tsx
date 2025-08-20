"use client"

import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Card } from '@/components/cards/card';
// Update the path below if your Input component is located elsewhere
import InputWithLabel from '@/components/input/input-with-label';
import { Button } from '@/components/button/button';
import  Breadcrumbs  from '@/components/breadcrumbs/breadcrumbs';
import  Badge  from '@/components/badge/badge';
import { Label } from '@/components/label/label';
import  TextArea  from '@/components/input/text-area';
import IconSave from "@/components/icon/icon-save";
import { useParams } from 'next/navigation';

const StoreDetailsPage = () => {
    const params = useParams();
    const [storeId, setStoreId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (params?.id) {
            setStoreId(params.id as string);
        }
    }, [params]);

    // Simulación de datos, reemplazar por fetch real si es necesario
    const storeData = {
        name: 'TechStore Premium',
        description: 'Tienda especializada en productos tecnológicos de alta gama',
        url: 'techstore-premium',
        email: 'contacto@techstore.com',
        phone: '+1 234 567 8900',
        address: '123 Tech Avenue, Silicon Valley',
        returnPolicy: 'Devoluciones aceptadas dentro de 30 días',
        shippingPolicy: 'Envíos gratis en compras mayores a $50',
        serviceTerms: 'Términos y condiciones estándar',
        logo: '/logo.png',
        status: 'Activo',
    };

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs
                items={[
                    { label: 'Volver a Tiendas' },
                    { label: storeData.name },
                ]}
            />

            <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{storeData.name}</h2>
                <Badge variant="success">{storeData.status}</Badge>
            </div>
            <div className="flex gap-4">
                <Button variant="secondary" size="sm" >
                    Volver
                </Button>
            </div>

            <Card className="p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Label>Estado de la Tienda</Label>
                    <Badge variant="success">Tienda activa y visible para clientes</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información Básica */}
                    <Card className="flex flex-col gap-4">
                        <Label>Información Básica</Label>
                        {/* <InputWithLabel label="Nombre de la Tienda" value={storeData.name} readOnly />
                        <TextArea label="Descripción" value={storeData.description} readOnly />
                        <InputWithLabel label="URL Amigable" value={storeData.url} readOnly prefix="onliza.mx/" />
 */}                        <div className="flex flex-col gap-2">
                            <Label>Logo de la Tienda</Label>
                            <div className="flex items-center gap-2">
                                <img src={storeData.logo} alt="Logo" className="w-12 h-12 rounded bg-white border" />
                                <Button variant="primary" outline size="sm" disabled>
                                    Cambiar Logo
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Información de Contacto */}
                    <Card className="flex flex-col gap-4">
                        <Label>Información de Contacto</Label>
                        <InputWithLabel label="Email de Contacto" value={storeData.email} readOnly id={''} onChange={function (_: ChangeEvent<HTMLInputElement>): void {
                            throw new Error('Function not implemented.');
                        } }  />
                        <InputWithLabel label="Teléfono de Contacto" value={storeData.phone} readOnly id={''} onChange={function (_: ChangeEvent<HTMLInputElement>): void {
                            throw new Error('Function not implemented.');
                        } }  />
                        <TextArea  value={storeData.address} onChange={function (value: string): void {
                            throw new Error('Function not implemented.');
                        } }  />
                    </Card>
                </div>

                {/* Políticas de la Tienda */}
                <Card className="flex flex-col gap-4">
                    <Label>Políticas de la Tienda</Label>
                    {/* <TextArea label="Política de Devoluciones" value={storeData.returnPolicy}  />
                    <TextArea label="Política de Envío" value={storeData.shippingPolicy} readOnly />
                    <TextArea label="Términos de Servicio" value={storeData.serviceTerms} readOnly />
 */}                </Card>

                <div className="flex justify-end">
                    <Button variant="primary"  disabled>
                        <IconSave className="w-4 h-4 mr-2" />
                        Guardar Cambios
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default StoreDetailsPage;
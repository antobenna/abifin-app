import { Card, CardBody, Chip } from '@heroui/react';

/**
 * StatCard - Componente per visualizzare i contatori della Dashboard
 * @param {string} title - Etichetta del contatore
 * @param {number|string} value - Valore numerico da mostrare
 * @param {React.Component} icon - Componente icona (SVG)
 * @param {string} iconClass - Classi Tailwind per il contenitore dell'icona
 * @param {string} chipLabel - (Opzionale) Testo del Chip di stato
 * @param {string} chipColor - (Opzionale) Colore semantico HeroUI per il Chip
 */
export default function StatCard({ 
    title, 
    value, 
    icon: Icon, 
    iconClass, 
    chipLabel, 
    chipColor = "default" 
}) {
    return (
        <Card radius='lg' className="border border-gray-200 shadow-sm">
            <CardBody className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg ${iconClass}`}>
                        <Icon />
                    </div>
                    {chipLabel && (
                        <Chip 
                            size="sm" 
                            variant="flat" 
                            color={chipColor}
                            className="font-semibold"
                        >
                            {chipLabel}
                        </Chip>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
                </div>
            </CardBody>
        </Card>
    );
}
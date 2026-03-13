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
        <Card 
            radius="lg" 
            shadow="sm"
            className="bg-content1 border-small border-divider"
        >
            <CardBody className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-xl ${iconClass}`}>
                        <Icon size={24} />
                    </div>
                    {chipLabel && (
                        <Chip 
                            size="sm" 
                            variant="flat" 
                            color={chipColor}
                            className="font-semibold capitalize"
                        >
                            {chipLabel}
                        </Chip>
                    )}
                </div>
                <div>
                    
                    <p className="text-xs font-semibold uppercase tracking-wider text-default-500">
                        {title}
                    </p>
                   
                    <p className="text-3xl font-bold mt-1 text-foreground">
                        {value}
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}
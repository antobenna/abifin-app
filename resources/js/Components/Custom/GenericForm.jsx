import { Link } from '@inertiajs/react';
import { Button } from '@heroui/react';

export default function GenericForm({ subtitle, onSubmit, cancelHref, processing, children }) {
    return (
        <div className="py-12">
            <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <form onSubmit={onSubmit} className="p-8">
                        {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
                        <div className="space-y-6">{children}</div>
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                            <Button as={Link} href={cancelHref} variant="flat">
                                Annulla
                            </Button>
                            <Button type="submit" color="primary" isLoading={processing}>
                                Salva
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

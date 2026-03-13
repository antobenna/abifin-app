export default function CustomTextarea({ label, value, onValueChange, isInvalid, errorMessage, isRequired, placeholder, rows = 4 }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all resize-none
                    ${isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
            />
            {isInvalid && errorMessage && (
                <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}

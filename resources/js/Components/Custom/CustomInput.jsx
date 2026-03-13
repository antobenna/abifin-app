export default function CustomInput({ label, value, onValueChange, isInvalid, errorMessage, isRequired, type = 'text', placeholder }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all
                    ${isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
            />
            {isInvalid && errorMessage && (
                <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}

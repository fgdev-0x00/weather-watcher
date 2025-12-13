import { CloudSun } from 'lucide-react';

export default function LogoBanner() {
    return (
        <div className="text-indigo-600 mb-2">
            <CloudSun className="w-10 h-10 mx-auto" />
            <span className="block mt-1 tracking-widest text-base font-semibold">
                WEATHERAPP
            </span>
        </div>
    );
}
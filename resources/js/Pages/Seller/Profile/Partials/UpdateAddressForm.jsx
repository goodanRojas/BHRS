import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import ph from '@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';
import PrimaryButton from '@/Components/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
export default function UpdateAddressForm({ className = '', address }) {
    console.log(address);
    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful, } = useForm({
            address: {
                region: '',
                province: '',
                municipality: '',
                barangay: '',
            },
        });
    const [isEditing, setIsEditing] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('seller.profile.address.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.address) {
                    reset('address');
                }
            },
        });
    };
    const regions = Object.entries(ph);
    const provinces = data.address.region
        ? Object.keys(ph[data.address.region].province_list)
        : [];
    const municipalities = data.address.province
        ? Object.keys(
            ph[data.address.region].province_list[data.address.province].municipality_list
        )
        : [];
    const barangays = data.address.municipality
        ? ph[data.address.region].province_list[data.address.province].municipality_list[
            data.address.municipality
        ].barangay_list
        : [];
    return (
        <section className={className}>
            <header>
                <div className='flex items-center gap-4'>
                    <h2 className="text-lg font-medium text-gray-900">
                        Address
                    </h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                    ><FontAwesomeIcon className='text-gray-00 hover:text-gray-700' icon={faPencilAlt} /></button>
                </div>


                {!isEditing && (
                    <div className="p-4">
                        {address && address.address ? (
                            <p className="text-gray-700 font-medium">
                                {address.address.barangay}, {address.address.city}, {address.address.province}
                            </p>
                        ) : (
                            <p className="text-gray-700 font-medium">No address provided</p>
                        )}

                    </div>
                )}



                {isEditing && (
                    < form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="block">
                                <span>Region</span>
                                <select
                                    value={data.address.region}
                                    onChange={(e) =>
                                        setData('address', {
                                            region: e.target.value,
                                            province: '',
                                            municipality: '',
                                            barangay: '',
                                        })
                                    }
                                    className="mt-1 block w-full rounded border-gray-300"
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(([key, region]) => (
                                        <option key={key} value={key}>
                                            {region.region_name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span>Province</span>
                                <select
                                    value={data.address.province}
                                    onChange={(e) =>
                                        setData('address', {
                                            ...data.address,
                                            province: e.target.value,
                                            municipality: '',
                                            barangay: '',
                                        })
                                    }
                                    className="mt-1 block w-full rounded border-gray-300"
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map((prov) => (
                                        <option key={prov} value={prov}>
                                            {prov}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span>Municipality</span>
                                <select
                                    value={data.address.municipality}
                                    onChange={(e) =>
                                        setData('address', {
                                            ...data.address,
                                            municipality: e.target.value,
                                            barangay: '',
                                        })
                                    }
                                    className="mt-1 block w-full rounded border-gray-300"
                                >
                                    <option value="">Select Municipality</option>
                                    {municipalities.map((mun) => (
                                        <option key={mun} value={mun}>
                                            {mun}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span>Barangay</span>
                                <select
                                    value={data.address.barangay}
                                    onChange={(e) =>
                                        setData('address', {
                                            ...data.address,
                                            barangay: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded border-gray-300"
                                >
                                    <option value="">Select Barangay</option>
                                    {barangays.map((brgy, idx) => (
                                        <option key={idx} value={brgy}>
                                            {brgy}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <PrimaryButton
                                type="submit"
                                className=''
                                disabled={processing}
                            >
                                Save
                            </PrimaryButton>
                        </div>
                    </form>

                )}

            </header>
        </section >
    )
}
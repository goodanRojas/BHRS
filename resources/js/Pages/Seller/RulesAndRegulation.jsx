import { faInfo, faEdit, faTrash, faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function RulesAndRegulation({ buildingId }) {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    // Form states
    const [newRuleTitle, setNewRuleTitle] = useState('');
    const [newRuleDesc, setNewRuleDesc] = useState('');
    const [editRuleId, setEditRuleId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchRules = () => {
        setLoading(true);
        axios.get(`/seller/building/${buildingId}/rules`)
            .then((res) => setRules(res.data.rules))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRules();
    }, [buildingId]);

    // Add a new rule
    const handleAddRule = (e) => {
        e.preventDefault();
        if (!newRuleTitle || !newRuleDesc) return;

        axios.post(`/seller/building/${buildingId}/rules`, {
            title: newRuleTitle,
            description: newRuleDesc
        })
            .then((res) => {
                setRules(prev => [...prev, res.data.rule]);
                setNewRuleTitle('');
                setNewRuleDesc('');
            })
            .catch(err => console.error(err));
    };

    // Start editing a rule
    const handleEdit = (rule) => {
        setEditRuleId(rule.id);
        setEditTitle(rule.title);
        setEditDesc(rule.description);
    };

    // Save edited rule
    const handleUpdateRule = (e) => {
        e.preventDefault();
        if (!editTitle || !editDesc) return;

        axios.put(`/seller/building/rules/${editRuleId}`, {
            title: editTitle,
            description: editDesc
        })
            .then((res) => {
                setRules(prev => prev.map(rule => rule.id === editRuleId ? res.data.rule : rule));
                setEditRuleId(null);
            })
            .catch(err => console.error(err));
    };

    // Delete a rule
    const handleDelete = (ruleId) => {
        if (!window.confirm('Are you sure you want to delete this rule?')) return;

        axios.delete(`/seller/building/rules/${ruleId}`)
            .then(() => {
                setRules(prev => prev.filter(rule => rule.id !== ruleId));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="mt-4">
            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center justify-between'>
                    <button
                        onClick={() => setShow(!show)}
                    >
                        <FontAwesomeIcon icon={faInfoCircle}
                            className='text-blue-500 hover:text-blue-700 px-2'
                        />
                    </button>
                    <h2 className="text-xl font-semibold ">Rules And Regulations</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-green-500 hover:text-green-700 ml-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>

            {show && (
                <div className="mt-2">
                    {loading ? (
                        <div className="flex justify-center items-center mt-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <>
                            {rules.length === 0 ? (
                                <p className="text-gray-600 text-sm">No rules found for this building.</p>
                            ) : (
                                <ul className="list-disc ml-5 text-gray-700">
                                    {rules.map((rule) => (
                                        <li key={rule.id} className="mb-2 flex justify-between items-start">
                                            {editRuleId === rule.id ? (
                                                <form className="flex flex-col w-full" onSubmit={handleUpdateRule}>
                                                    <input
                                                        type="text"
                                                        className="border rounded px-2 py-1 mb-1"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        placeholder="Title"
                                                    />
                                                    <textarea
                                                        className="border rounded px-2 py-1 mb-1"
                                                        value={editDesc}
                                                        onChange={(e) => setEditDesc(e.target.value)}
                                                        placeholder="Description"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button type="submit" className="text-green-500 hover:text-green-700">Save</button>
                                                        <button onClick={() => setEditRuleId(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div>
                                                        <span className="font-semibold">{rule.title}: </span>
                                                        <span>{rule.description}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(rule)} className="text-blue-500 hover:text-blue-700">
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button onClick={() => handleDelete(rule.id)} className="text-red-500 hover:text-red-700">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </>
                    )}
                </div>
            )}

            {/* Add new rule form inside show */}
            <div className="mt-4">

                {showAddForm && (
                    <form className="flex flex-col gap-2 mt-2" onSubmit={handleAddRule}>
                        <input
                            type="text"
                            className="border rounded px-2 py-1"
                            placeholder="Title"
                            value={newRuleTitle}
                            onChange={(e) => setNewRuleTitle(e.target.value)}
                        />
                        <textarea
                            className="border rounded px-2 py-1"
                            placeholder="Description"
                            value={newRuleDesc}
                            onChange={(e) => setNewRuleDesc(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            Add Rule
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

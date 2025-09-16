import { faEdit, faTrash, faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

    const handleAddRule = (e) => {
        e.preventDefault();
        if (!newRuleTitle || !newRuleDesc) return;

        axios.post(`/seller/building/${buildingId}/rules`, { title: newRuleTitle, description: newRuleDesc })
            .then((res) => {
                setRules(prev => [...prev, res.data.rule]);
                setNewRuleTitle('');
                setNewRuleDesc('');
                setShowAddForm(false);
            })
            .catch(err => console.error(err));
    };

    const handleEdit = (rule) => {
        setEditRuleId(rule.id);
        setEditTitle(rule.title);
        setEditDesc(rule.description);
    };

    const handleUpdateRule = (e) => {
        e.preventDefault();
        if (!editTitle || !editDesc) return;

        axios.put(`/seller/building/rules/${editRuleId}`, { title: editTitle, description: editDesc })
            .then((res) => {
                setRules(prev => prev.map(rule => rule.id === editRuleId ? res.data.rule : rule));
                setEditRuleId(null);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (ruleId) => {
        if (!window.confirm('Are you sure you want to delete this rule?')) return;

        axios.delete(`/seller/building/rules/${ruleId}`)
            .then(() => setRules(prev => prev.filter(rule => rule.id !== ruleId)))
            .catch(err => console.error(err));
    };

    return (
        <div className="mt-4">
            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                    <button onClick={() => setShow(!show)}>
                        <FontAwesomeIcon icon={faInfoCircle} className='text-blue-500 hover:text-blue-700 transition' />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800">Rules & Regulations</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-green-500 hover:text-green-700 transition flex items-center gap-1"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="text-sm font-medium">Add Rule</span>
                </button>
            </div>

            <AnimatePresence>
                {show && (
                    <motion.div
                        className="mt-4 space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center mt-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (
                            <>
                                {rules.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No rules found for this building.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {rules.map(rule => (
                                            <motion.li
                                                key={rule.id}
                                                className="bg-white shadow-sm rounded-lg p-3 flex justify-between items-start hover:shadow-md transition"
                                                layout
                                            >
                                                {editRuleId === rule.id ? (
                                                    <form className="flex flex-col w-full gap-2" onSubmit={handleUpdateRule}>
                                                        <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            placeholder="Title"
                                                        />
                                                        <textarea
                                                            className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                                            value={editDesc}
                                                            onChange={(e) => setEditDesc(e.target.value)}
                                                            placeholder="Description"
                                                        />
                                                        <div className="flex gap-2 mt-1">
                                                            <button type="submit" className="text-green-500 hover:text-green-700">Save</button>
                                                            <button onClick={() => setEditRuleId(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <div className="flex-1">
                                                            <span className="font-semibold text-gray-800">{rule.title}: </span>
                                                            <span className="text-gray-700">{rule.description}</span>
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
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add new rule form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.form
                        className="flex flex-col gap-2 mt-4 bg-gray-50 p-4 rounded-lg shadow-sm"
                        onSubmit={handleAddRule}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <input
                            type="text"
                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Title"
                            value={newRuleTitle}
                            onChange={(e) => setNewRuleTitle(e.target.value)}
                        />
                        <textarea
                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Description"
                            value={newRuleDesc}
                            onChange={(e) => setNewRuleDesc(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-sm transition">
                            Add Rule
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}

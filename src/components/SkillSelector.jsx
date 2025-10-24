// src/components/SkillSelector.jsx
import React from 'react';
import Select from 'react-select';

const SkillSelector = ({ selectedSkills, onChange, skillsList }) => {
    const options = skillsList.map(skill => ({ label: skill, value: skill }));

    const handleChange = (selectedOptions) => {
        const values = selectedOptions.map(option => option.value);
        onChange(values);
    };

    return (
        <div>
            <label className="block font-medium text-black-700 mb-1">Aptitudes</label>
            <Select
                options={options}
                value={options.filter(option => selectedSkills.includes(option.value))}
                onChange={handleChange}
                isMulti
                placeholder="Selecciona tus habilidades..."
                className="text-sm"
            />
        </div>
    );
};

export default SkillSelector;

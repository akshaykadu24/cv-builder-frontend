import { MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FieldValidate from './FieldValidate';

const ResumeForm = ({ formData, setFormData, formError, setFormError }) => {
    const router = useRouter();
    const [collapsedSections, setCollapsedSections] = useState({});


    const toggleCollapse = (section) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const parseFontValue = (val) => {
        const number = parseInt(val, 10);
        return isNaN(number) ? val : number;
    };

    const [isMobile, setIsMobile] = useState(false);

    let handleValidation = (field, value) => {
        console.log(field, value)
        if (field == "level") {
            if (value < 0 || value > 100) {
                alert("It accepts only in %, Please fill 0-100")
            }
        }

    }
    console.log(formData)
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const availableFonts = [
        'Arial, sans-serif',
        'Times New Roman, serif',
        'Georgia, serif',
        'Tahoma, sans-serif',
        'Verdana, sans-serif',
        'Courier New, monospace',
        'Roboto, sans-serif',
    ];

    const handleChange = (section, key, value, index = null) => {
        if (section === "resumeName") {
            setFormData(prev => ({
                ...prev,
                [key]: value
            }));
        } else if (index !== null) {
            const updated = [...formData[section]];
            updated[index][key] = value;
            setFormData(prev => ({ ...prev, [section]: updated }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value
                }
            }));
        }
    };
    console.log(formError)
    const handleSubmit = async () => {
        setFormError(formData)

        let validationArray = ["resumeName", "name", "email", "degree", "institution", "organization", "joiningLocation", "position", "title", "description", "name", "level"]
        function isFieldMissing(field, formData) {
            switch (field) {
                case "resumeName":
                    return !formData.resumeName;

                case "name":
                case "email":
                    return !formData.basicDetails?.[field];

                case "degree":
                case "institution":
                    return !formData.education?.some(item => item[field]);

                case "organization":
                case "joiningLocation":
                case "position":
                    return !formData.experience?.some(item => item[field]);

                case "title":
                case "description":
                    return !formData.project?.some(item => item[field]);

                case "skillName":
                    return !formData.skill?.some(item => item.skillName);

                case "level":
                    return !formData.skill?.some(item => item.level >= 1 && item.level <= 100);

                default:
                    return false;
            }
        }

        function validateFormData(formData) {
            const missing = validationArray.filter(field => isFieldMissing(field, formData));
            return {
                isValid: missing.length === 0,
                missingFields: missing
            };
        }

        const validationResult = validateFormData(formData);

        if (!validationResult.isValid) {

            // console.log("Missing fields:", validationResult.missingFields);
            // alert("Please fill in: " + validationResult.missingFields.join(", "));
        } else {

            try {

                const cookieToken = document?.cookie?.split('; ').find(row => row.startsWith('ResumeToken='));
                const token = cookieToken?.split('=')[1];
                const url = router.query?.rid
                    ? `${process.env.NEXT_PUBLIC_API_URL}updateResume/${router.query?.rid}`
                    : `${process.env.NEXT_PUBLIC_API_URL}createResume`;
                const method = router.query?.rid ? "PATCH" : "POST";

                const res = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify(formData)
                });

                const data = await res.json();
                alert(data?.msg);
            } catch (error) {
                console.error("Error submitting resume:", error);
            }
        }

    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
    };

    const inputStyle = {
        display: 'block',
        marginBottom: '10px',
        padding: '8px',
        width: '100%',
        borderRadius: '4px',
        border: '1px solid #ddd'
    };

    const buttonStyle = {
        marginRight: '10px',
        padding: '6px 12px',
        cursor: 'pointer',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff'
    };

    const removeButtonStyle = {
        ...buttonStyle,
        backgroundColor: 'red'
    };

    const renderCollapsibleSection = (title, sectionKey, content) => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{title}</h3>
                <button onClick={() => toggleCollapse(sectionKey)} style={buttonStyle}>
                    {collapsedSections[sectionKey] ? "Show" : "Hide"}
                </button>
            </div>
            {!collapsedSections[sectionKey] && content}
        </div>
    );


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => (({
                    ...prev,
                    basicDetails: {
                        ...prev.basicDetails,
                        image: reader.result
                    }
                })))
                // setPreview(reader.result);
                // onImageChange(reader.result); // send base64 to parent
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2>Create Your Resume</h2><br />

            {renderCollapsibleSection("Resume Name", "resumeName", (
                <div style={cardStyle}>
                    <input
                        placeholder="Resume name"
                        value={formData.resumeName}
                        onChange={e => handleChange("resumeName", "resumeName", e.target.value?.trim())}
                        style={inputStyle}
                    />
                    <FieldValidate fieldValue={formData?.resumeName} fieldName={"Resume Name"} />
                </div>
            ))}
            <br />
            {renderCollapsibleSection("Basic Details", "basicDetails", (
                <div style={cardStyle}>
                    {Object.keys(formData.basicDetails).map((field, index) => (
                        field !== "_id" && (
                            field == "image" ?
                                <div style={{ textAlign: 'center', margin: '20px 0' }} key={index}>
                                    User Image:
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                    {formData?.basicDetails?.[field] && <img src={formData?.basicDetails[field]} alt="Preview" style={{ width: 100, height: 100, borderRadius: '50%', marginTop: 10 }} />}
                                </div>
                                : <>
                                    <input
                                        key={index}
                                        placeholder={(field == "name" || field == "email") ? `${field}*` : field}
                                        value={formData.basicDetails[field] || ""}
                                        onChange={e => handleChange("basicDetails", field, e.target.value?.trim())}
                                        style={inputStyle}
                                    />
                                    {
                                        (field == "name" || field == "email") ?
                                            <FieldValidate fieldValue={formError?.basicDetails?.[field]} fieldName={field} />
                                            : null
                                    }
                                </>

                        )
                    ))}
                </div>
            ))}
            <br />
            {renderCollapsibleSection("Education", "education", (
                <div>
                    {formData.education.map((edu, index) => (
                        <div key={index} style={cardStyle}>
                            {Object.keys(edu).map(field => (
                                field !== "_id" && (
                                    <>
                                        <input
                                            key={field}
                                            placeholder={(field == "degree" || field == "institution") ? `${field}*` : field}
                                            value={edu[field]}
                                            onChange={e => handleChange("education", field, e.target.value?.trim(), index)}
                                            style={inputStyle}
                                        />
                                        {
                                            (field == "degree" || field == "institution") ?
                                                <FieldValidate fieldValue={formError?.education?.[0]?.[field]} fieldName={field} />
                                                : null
                                        }
                                    </>
                                )
                            ))}
                            {formData.education.length > 1 && index !== 0 && (
                                <button
                                    onClick={() => {
                                        const updated = formData.education.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, education: updated }));
                                    }}
                                    style={removeButtonStyle}
                                >❌ Remove</button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                education: [...prev.education, {
                                    degree: "", institution: "", percentage: "",
                                    startYear: "", endYear: "", location: ""
                                }]
                            }));
                        }}
                        style={buttonStyle}
                    >➕ Add Education</button>
                </div>
            ))}
            <br />
            {renderCollapsibleSection("Experience", "experience", (
                <div>
                    {formData.experience.map((exp, index) => (
                        <div key={index} style={cardStyle}>
                            {Object.keys(exp).map(field => (
                                field !== "_id" && (
                                    <>
                                        <input
                                            key={field}
                                            placeholder={(field == "organization" || field == "joiningLocation" || field == "position") ? `${field}*` : field}
                                            value={exp[field] || ""}
                                            onChange={e => handleChange("experience", field, e.target.value, index)}
                                            style={inputStyle}
                                        />
                                        {
                                            (field == "organization" || field == "joiningLocation" || field == "position") ?
                                                <FieldValidate fieldValue={formError?.experience?.[0]?.[field]} fieldName={field} />
                                                : null
                                        }

                                    </>
                                )
                            ))}
                            {formData.experience.length > 1 && index !== 0 && (
                                <button
                                    onClick={() => {
                                        const updated = formData.experience.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, experience: updated }));
                                    }}
                                    style={removeButtonStyle}
                                >❌ Remove</button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                experience: [...prev.experience, {
                                    organization: "", joiningLocation: "", position: "",
                                    CTC: "", joiningDate: "", leavingDate: "", technologies: ""
                                }]
                            }));
                        }}
                        style={buttonStyle}
                    >➕ Add Experience</button>
                </div>
            ))}
            <br />
            {renderCollapsibleSection("Projects", "project", (
                <div>
                    {formData.project.map((proj, index) => (
                        <div key={index} style={cardStyle}>
                            {Object.keys(proj).map(field => (
                                field !== "_id" && (
                                    <>
                                        <input
                                            key={field}
                                            type={field == "teamSize" ? "number" : "string"}
                                            placeholder={(field == "title" || field == "description") ? `${field}*` : field}
                                            value={proj[field] || ""}
                                            onChange={e => { handleChange("project", field, e.target.value, index), handleValidation(field, e.target.value) }}
                                            style={inputStyle}
                                        />
                                        {
                                            (field == "title" || field == "description") ?
                                                <FieldValidate fieldValue={formError?.project?.[0]?.[field]} fieldName={field} />
                                                : null
                                        }

                                    </>
                                )
                            ))}
                            {formData.project.length > 1 && index !== 0 && (
                                <button
                                    onClick={() => {
                                        const updated = formData.project.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, project: updated }));
                                    }}
                                    style={removeButtonStyle}
                                >❌ Remove</button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                project: [...prev.project, {
                                    title: "", teamSize: "", duration: "",
                                    technologies: "", description: ""
                                }]
                            }));
                        }}
                        style={buttonStyle}
                    >➕ Add Project</button>
                </div>
            ))}
            <br />
            {renderCollapsibleSection("Skills", "skill", (
                <div>
                    {formData.skill.map((proj, index) => (
                        <div key={index} style={cardStyle}>
                            {Object.keys(proj).map((field, i) => (
                                field !== "_id" && (
                                    <>
                                        <input
                                            key={field}
                                            type={field == "level" ? "number" : "string"}
                                            placeholder={i === 0 ? `Skill Name ${index + 1}*` : `Skill Level (%)*`}
                                            value={proj[field] || ""}
                                            onChange={e => { handleChange("skill", field, e.target.value, index), handleValidation(field, e.target.value) }}
                                            style={inputStyle}
                                            min={field === "level" ? 0 : undefined}
                                            max={field === "level" ? 100 : undefined}

                                        />
                                        <FieldValidate fieldValue={formError?.skill?.[0]?.[field]} fieldName={field} />

                                    </>
                                )
                            ))}
                            {formData.skill.length > 1 && index !== 0 && (
                                <button
                                    onClick={() => {
                                        const updated = formData.skill.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, skill: updated }));
                                    }}
                                    style={removeButtonStyle}
                                >❌ Remove</button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                skill: [...prev.skill, {
                                    skillName: "", level: ""
                                }]
                            }));
                        }}
                        style={buttonStyle}
                    >➕ Add Skill</button>
                </div>
            ))}
            <br />
            {renderCollapsibleSection("Social Profiles", "socialProfile", (
                <div>
                    {formData.socialProfile.map((proj, index) => (
                        <div key={index} style={cardStyle}>
                            {Object.keys(proj).map((field, i) => (
                                field !== "_id" && (
                                    <>
                                        <input
                                            key={field}
                                            placeholder={i === 0 ? `Platform ${index + 1}` : `Profile URL`}
                                            value={proj[field] || ""}
                                            onChange={e => handleChange("socialProfile", field, e.target.value, index)}
                                            style={inputStyle}
                                        />
                                        {/* <FieldValidate fieldValue={formError?.socialProfile?.[0]?.[field]} fieldName={field} /> */}

                                    </>
                                )
                            ))}
                            {formData.socialProfile.length > 1 && index !== 0 && (
                                <button
                                    onClick={() => {
                                        const updated = formData.socialProfile.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, socialProfile: updated }));
                                    }}
                                    style={removeButtonStyle}
                                >❌ Remove</button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                socialProfile: [...prev.socialProfile, {
                                    platform: "", url: ""
                                }]
                            }));
                        }}
                        style={buttonStyle}
                    >➕ Add Social Profiles</button>
                </div>

            ))}
            <br />
            {/* Font Configuration */}
            <div>
                <h3>Font Settings</h3>
                <div style={cardStyle}>
                    {Object.keys(formData?.fontConfig || {}).map((key) =>
                        key === 'bodyFont' ? (
                            <div
                                key={key}
                                style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    alignItems: isMobile ? 'flex-start' : 'center',
                                    marginBottom: '10px',
                                    gap: '10px'
                                }}
                            >
                                <label style={{ minWidth: isMobile ? '100%' : '120px' }}>Body Font</label>
                                <Select
                                    fullWidth
                                    value={formData?.fontConfig?.bodyFont || ''}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            fontConfig: {
                                                ...prev.fontConfig,
                                                bodyFont: e.target.value,
                                            },
                                        }))
                                    }
                                    style={{ flex: 1 }}
                                >
                                    {availableFonts.map((font) => (
                                        <MenuItem key={font} value={font}>
                                            {font}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        ) : (
                            <div
                                key={key}
                                style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    alignItems: isMobile ? 'flex-start' : 'center',
                                    marginBottom: '10px',
                                    gap: '10px'
                                }}
                            >
                                <label style={{ minWidth: isMobile ? '100%' : '120px' }}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    placeholder={key}
                                    value={formData?.fontConfig?.[key] || ''}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            fontConfig: {
                                                ...prev.fontConfig,
                                                [key]: parseFontValue(e.target.value),
                                            },
                                        }))
                                    }
                                    style={{
                                        ...inputStyle,
                                        marginBottom: 0,
                                        flex: 1,
                                        width: '100%',
                                    }}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>



            <button onClick={handleSubmit} style={{ ...buttonStyle, marginTop: '20px', padding: "15px", fontSize: "16px" }}>
                Submit Resume
            </button>
        </div>
    );
};

export default ResumeForm;

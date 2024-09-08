interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
}

interface Education {
    school: string;
    degree: string;
    gradYear: number;
}

interface WorkExperience {
    company: string;
    position: string;
    years: number;
}

interface ResumeData {
    personalInfo: PersonalInfo;
    education: Education;
    workExperience: WorkExperience;
    skills: string[];
}

const form = document.getElementById("resume-form") as HTMLFormElement;
const resumeDiv = document.getElementById("resume") as HTMLDivElement;
const editButton = document.getElementById("edit-resume-btn") as HTMLButtonElement;
const saveButton = document.getElementById("save-resume-btn") as HTMLButtonElement;

let resumeData: ResumeData

form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const formData = new FormData(form);

    // Extract data from the form
    resumeData = {
        personalInfo: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
        },
        education: {
            school: formData.get("school") as string,
            degree: formData.get("degree") as string,
            gradYear: parseInt(formData.get("grad-year") as string),
        },
        workExperience: {
            company: formData.get("company") as string,
            position: formData.get("position") as string,
            years: parseInt(formData.get("years") as string),
        },
        skills: (formData.get("skills") as string).split(",").map(skill => skill.trim()),
    };

    // Generate resume HTML
    generateResumeHTML();

    // Show the edit button
    editButton.style.display = "inline";
});

editButton.addEventListener("click", () => {
    switchToEditMode();
});

saveButton.addEventListener("click", () => {
    saveChanges();
    generateResumeHTML(); // Re-render the updated resume
    switchToViewMode();
});

function generateResumeHTML() {
    const resumeHTML = `
        <h3>${resumeData.personalInfo.name}</h3>
        <p>Email: ${resumeData.personalInfo.email}</p>
        <p>Phone: ${resumeData.personalInfo.phone}</p>

        <h4>Education</h4>
        <p>${resumeData.education.degree} from ${resumeData.education.school}, ${resumeData.education.gradYear}</p>

        <h4>Work Experience</h4>
        <p>${resumeData.workExperience.position} at ${resumeData.workExperience.company} (${resumeData.workExperience.years} years)</p>

        <h4>Skills</h4>
        <ul>
            ${resumeData.skills.map(skill => `<li>${skill}</li>`).join("")}
        </ul>
    `;

    resumeDiv.innerHTML = resumeHTML;
}

function switchToEditMode() {
    resumeDiv.innerHTML = `
        <h3><input type="text" id="edit-name" value="${resumeData.personalInfo.name}"></h3>
        <p>Email: <input type="email" id="edit-email" value="${resumeData.personalInfo.email}"></p>
        <p>Phone: <input type="text" id="edit-phone" value="${resumeData.personalInfo.phone}"></p>

        <h4>Education</h4>
        <p>
            <input type="text" id="edit-degree" value="${resumeData.education.degree}"> from 
            <input type="text" id="edit-school" value="${resumeData.education.school}">,
            <input type="number" id="edit-grad-year" value="${resumeData.education.gradYear}">
        </p>

        <h4>Work Experience</h4>
        <p>
            <input type="text" id="edit-position" value="${resumeData.workExperience.position}"> at
            <input type="text" id="edit-company" value="${resumeData.workExperience.company}"> 
            (<input type="number" id="edit-years" value="${resumeData.workExperience.years}"> years)
        </p>

        <h4>Skills</h4>
        <input type="text" id="edit-skills" value="${resumeData.skills.join(", ")}">
    `;

    // Show the save button, hide the edit button
    editButton.style.display = "none";
    saveButton.style.display = "inline";
}

function switchToViewMode() {
    // Hide the save button, show the edit button
    editButton.style.display = "inline";
    saveButton.style.display = "none";
}

function saveChanges() {
    // Capture the updated information from the edit fields
    resumeData.personalInfo.name = (document.getElementById("edit-name") as HTMLInputElement).value;
    resumeData.personalInfo.email = (document.getElementById("edit-email") as HTMLInputElement).value;
    resumeData.personalInfo.phone = (document.getElementById("edit-phone") as HTMLInputElement).value;

    resumeData.education.degree = (document.getElementById("edit-degree") as HTMLInputElement).value;
    resumeData.education.school = (document.getElementById("edit-school") as HTMLInputElement).value;
    resumeData.education.gradYear = parseInt((document.getElementById("edit-grad-year") as HTMLInputElement).value);

    resumeData.workExperience.position = (document.getElementById("edit-position") as HTMLInputElement).value;
    resumeData.workExperience.company = (document.getElementById("edit-company") as HTMLInputElement).value;
    resumeData.workExperience.years = parseInt((document.getElementById("edit-years") as HTMLInputElement).value);

    resumeData.skills = (document.getElementById("edit-skills") as HTMLInputElement).value.split(",").map(skill => skill.trim());
}


// Function to generate a random unique ID
function generateUniqueID(): string {
    return Math.random().toString(36).substring(2, 10); // A simple unique ID generator
}

// Function to get a query parameter from the URL
function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Update the TypeScript script

const resumeURLSpan = document.getElementById("resume-url") as HTMLSpanElement;
const copyURLButton = document.getElementById("copy-url-btn") as HTMLButtonElement;
const shareEmailButton = document.getElementById("share-email-btn") as HTMLButtonElement;

let resume_data: ResumeData;

// Check if a resume ID is provided in the URL, if so, load that resume from localStorage
const resumeID = getQueryParam("id");

if (resumeID) {
    // Load the resume data from localStorage
    const storedResume = localStorage.getItem(resumeID);
    if (storedResume) {
        resume_data = JSON.parse(storedResume);
        generateResumeHTML();
        showShareOptions(resumeID); // Show the unique URL and sharing options
    }
} else {
    // No resume ID in the URL, so we are creating a new resume
    form.addEventListener("submit", (event: Event) => {
        event.preventDefault();

        const formData = new FormData(form);

        resumeData = {
            personalInfo: {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
            },
            education: {
                school: formData.get("school") as string,
                degree: formData.get("degree") as string,
                gradYear: parseInt(formData.get("grad-year") as string),
            },
            workExperience: {
                company: formData.get("company") as string,
                position: formData.get("position") as string,
                years: parseInt(formData.get("years") as string),
            },
            skills: (formData.get("skills") as string).split(",").map(skill => skill.trim()),
        };

        generateResumeHTML();

        // Generate unique URL and store the resume
        const newResumeID = generateUniqueID();
        localStorage.setItem(newResumeID, JSON.stringify(resumeData));

        // Display the unique URL and sharing options
        showShareOptions(newResumeID);
    });
}

// Function to display the unique URL and sharing options
function showShareOptions(resumeID: string) {
    const uniqueURL = `${window.location.origin}${window.location.pathname}?id=${resumeID}`;
    resumeURLSpan.textContent = uniqueURL;

    // Copy URL to clipboard
    copyURLButton.addEventListener("click", () => {
        navigator.clipboard.writeText(uniqueURL).then(() => {
            alert("URL copied to clipboard");
        });
    });

    // Share via email
    shareEmailButton.addEventListener("click", () => {
        const subject = "Check out my resume!";
        const body = `Here is my resume: ${uniqueURL}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

// Function to generate the resume HTML (same as before)
function generate_resumeHTML() {
    const resumeHTML = `
        <h3>${resume_data.personalInfo.name}</h3>
        <p>Email: ${resume_data.personalInfo.email}</p>
        <p>Phone: ${resume_data.personalInfo.phone}</p>

        <h4>Education</h4>
        <p>${resume_data.education.degree} from ${resumeData.education.school}, ${resumeData.education.gradYear}</p>

        <h4>Work Experience</h4>
        <p>${resume_data.workExperience.position} at ${resumeData.workExperience.company} (${resumeData.workExperience.years} years)</p>

        <h4>Skills</h4>
        <ul>
            ${resume_data.skills.map(skill => `<li>${skill}</li>`).join("")}
        </ul>
    `;

    resumeDiv.innerHTML = resumeHTML;
}

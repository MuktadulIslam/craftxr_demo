export const registrationRequestMailToLink = (): string => {
    const adminEmail = "admin@craftxr.com"; // Replace with the actual admin email
    const subject = encodeURIComponent("Request for CraftXR Account Creation");
    const body = encodeURIComponent(
        `Hello CraftXR Admin,\n\nI would like to request an account on CraftXR.\n\nHere are my details:\n- Full Name: \n- Email: \n- Reason for Access: \n\nPlease let me know the next steps.\n\nThank you!\n[Your Name]`
    );

    return `mailto:${adminEmail}?subject=${subject}&body=${body}`;
};
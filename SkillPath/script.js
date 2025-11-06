function suggestCareer() {
    const interest = document.getElementById("interest").value;
    const strength = document.getElementById("strength").value;
    const resultBox = document.getElementById("result");

    resultBox.className = "";
    resultBox.textContent = "";

    if (!interest || !strength) {
        resultBox.className = "show";
        resultBox.textContent = "⚠️ Please select both your Interest and your Strength to get a suggestion.";
        return;
    }

    const key = `${interest}_${strength}`;

    const careerMap = {
        creative_design: "UI/UX Designer",
        creative_writing: "Content Creator / Copywriter",
        tech_coding: "Software Engineer",
        tech_analysis: "Data Scientist / Analyst",
        business_leadership: "Entrepreneur / CEO",
        business_analysis: "Business Analyst",
        numbers_analysis: "Financial Analyst",
        teaching_teaching: "Teacher / Professor",
        science_research: "Research Scientist",
        health_empathy: "Nurse / Therapist",
        mechanical_hands: "Mechanical Engineer / Technician",
        law_communication: "Lawyer",
        sports_fitness: "Fitness Coach",
        creative_communication: "Brand Strategist",
        tech_leadership: "Tech Project Manager",
        social_communication: "Public Relations Specialist",
        social_empathy: "Social Worker / Counselor",
        business_communication: "Marketing Manager",
        numbers_coding: "Machine Learning Engineer",
        teaching_communication: "Corporate Trainer",
        health_hands: "Surgeon / Medical Technician",
        arts_design: "Graphic Designer",
        law_analysis: "Legal Analyst",
        travel_communication: "Travel Consultant",
        sports_leadership: "Sports Team Manager",
        creative_analysis: "Market Researcher",
        tech_research: "AI Researcher",
        business_organization: "Operations Manager",
        travel_organization: "Logistics Coordinator",
        arts_writing: "Journalist / Author",
    };

    const compatibilityScores = {
        creative_design: 100, creative_writing: 95, tech_coding: 100, tech_analysis: 95, 
        business_leadership: 90, business_analysis: 90, numbers_analysis: 95, 
        teaching_teaching: 100, science_research: 95, health_empathy: 90, 
        mechanical_hands: 100, law_communication: 90, sports_fitness: 100,

        creative_communication: 85, tech_leadership: 80, social_communication: 80, 
        social_empathy: 75, business_communication: 75, numbers_coding: 85, 
        teaching_communication: 70, health_hands: 85, arts_design: 85, 
        law_analysis: 75, travel_communication: 70, sports_leadership: 70,
        
        creative_analysis: 65, tech_research: 60, business_organization: 60,
        travel_organization: 55, arts_writing: 65, 
        
        numbers_leadership: 50,
        social_organization: 55,
    };

    const score = compatibilityScores[key] || 40; 
    const career = careerMap[key] || "an excellent new path";
    
    resultBox.className = "show";

    if (score >= 80) {
        resultBox.textContent = `⭐ High Compatibility: ${score}%! Suggested Career: ${career}. This is an ideal fit!`;
    } else if (score >= 60) {
        resultBox.textContent = `👍 Moderate Compatibility: ${score}%. Consider exploring ${career}. This path aligns well with your skills.`;
    } else if (score >= 45) {
        resultBox.textContent = `💡 Potential Fit: ${score}%. You can pursue ${career}, though you may need to develop secondary skills.`;
    } else {
        resultBox.textContent = `🧐 Cross-Disciplinary Fit: ${score}%. This combination is unique! You might find success in a specialized niche or by pursuing a career in management or technical writing.`;
    }
}


document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");

    document.getElementById("themeToggle").textContent =
        document.body.classList.contains("light") ? "☀️" : "🌙";
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("themeToggle").textContent =
        document.body.classList.contains("light") ? "☀️" : "🌙";
});
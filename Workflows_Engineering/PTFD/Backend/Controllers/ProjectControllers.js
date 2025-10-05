const Project = require("../Model/ProjectModel");
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const getAllProjects = async (req, res, next) => {

    let projects;

    // get all projects
    try {
        projects = await Project.find();
    }catch (err) {
        console.log(err);
    }
    // if no projects found
    if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No projects found" });
      }
      
    // Display all projects
    return res.status(200).json({ projects });
};

// Data insert

const insertProject = async (req, res, next) => {
    const { pname, pnumber, pcode, plocation, pimg, ptype, pownerid, pownername, potelnumber, powmail, pdescription, ppriority, pbudget, pstatus, penddate ,pissues, pobservations } = req.body;

    let project;
    try {
        // Validate required fields
        if (!pname || !pnumber || !pcode || !plocation || !ptype || !pownerid || !pownername || !potelnumber || !pdescription || !ppriority || !pbudget || !pstatus || !penddate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate images array
        if (!pimg || !Array.isArray(pimg) || pimg.length === 0) {
            return res.status(400).json({ message: "At least one project image is required" });
        }

        console.log('Creating project with data:', {
            pname, pnumber, pcode, plocation, ptype, pownerid, pownername, potelnumber, powmail,
            pdescription, ppriority, pbudget, pstatus, penddate,
            pissues: pissues?.length || 0,
            pobservations: pobservations ? 'provided' : 'not provided',
            pimg: `${pimg.length} images`
        });

        project = new Project({
            pname,
            pnumber,
            pcode,
            plocation,
            pimg,
            ptype,
            pownerid,
            pownername,
            potelnumber,
            powmail,
            pdescription,
            ppriority,
            pbudget,
            pstatus,
            penddate,
            pissues,
            pobservations
        });
        await project.save();
        console.log('Project created successfully:', project._id);
        
        // Send notifications after successful project creation
        try {
            console.log('Attempting to send notifications...');
            console.log('Project email:', project.powmail);
            console.log('Project phone:', project.potelnumber);
            
            if (project.powmail) {
                console.log('Calling sendProjectEmail...');
                await sendProjectEmail(project.powmail, project, 'created');
            }
            
            if (project.potelnumber) {
                console.log('Calling sendProjectSMS...');
                console.log('Checking SMS configuration before calling sendProjectSMS...');
                console.log('isSMSConfigured():', isSMSConfigured());
                console.log('twilioClient:', !!twilioClient);
                await sendProjectSMS(project.potelnumber, project, 'created');
            } else {
                console.log('No phone number provided for SMS');
            }
            console.log('Notifications completed');
        } catch (notificationError) {
            console.error('Notification error (non-critical):', notificationError);
            // Don't fail the project creation if notifications fail
        }
        
        return res.status(200).json({ project, message: "Project created successfully with notifications sent" });
    } catch (err) {
        console.error('Error creating project:', err);
        return res.status(500).json({ message: err.message || "Error creating project" });
    }
}

// Get Projects by ID

const getProjectById = async (req, res, next) => {
    
    const projectId = req.params.id;

    let project;

    try{
        project = await Project.findById(projectId);
    } catch (err) {
        console.log(err);
    }
    // if project not found
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ project });
}

// Update project
const updateProject = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
          ...req.body,
          pupdatedat: Date.now(),   // 🔥 always refresh update timestamp
        },
        { new: true } // return updated doc
      );
  
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      res.json(updatedProject);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
// Delete Project

 const deleteProject = async (req, res, next) => {

    const projectId = req.params.id;

    let project;

    try {
        project = await Project.findByIdAndDelete(projectId);
    } catch (err) {
        console.log(err);
    }
    // if project not found
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
 }

 // Debug logging for environment variables
console.log('Environment variables check:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
console.log('- TWILIO_SID:', process.env.TWILIO_SID ? 'SET' : 'NOT SET');
console.log('- TWILIO_AUTH:', process.env.TWILIO_AUTH ? 'SET' : 'NOT SET');
console.log('- TWILIO_PHONE:', process.env.TWILIO_PHONE ? 'SET' : 'NOT SET');

// Nodemailer transport (use env vars)
const mailTransport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio client
let twilioClient = null;
try {
  if (process.env.TWILIO_SID && process.env.TWILIO_AUTH && process.env.TWILIO_SID.startsWith('AC')) {
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    console.log('Twilio client initialized successfully');
  } else {
    console.log('Twilio not configured properly. SMS notifications will be disabled.');
    if (process.env.TWILIO_SID && !process.env.TWILIO_SID.startsWith('AC')) {
      console.log('TWILIO_SID must start with "AC"');
    }
  }
} catch (err) {
  console.log('Failed to initialize Twilio client:', err.message);
}

// Check if email configuration is valid
const isEmailConfigured = () => {
  const configured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
  console.log('Email configuration check:', configured ? 'CONFIGURED' : 'NOT CONFIGURED');
  return configured;
};

// Check if SMS configuration is valid
const isSMSConfigured = () => {
  const configured = twilioClient && process.env.TWILIO_SID && process.env.TWILIO_AUTH && process.env.TWILIO_PHONE;
  console.log('SMS configuration check:', configured ? 'CONFIGURED' : 'NOT CONFIGURED');
  return configured;
};

async function sendProjectEmail(to, project, action = 'created') {
  // Don't send if email not configured or no recipient
  if (!to || !isEmailConfigured()) {
    console.log('Email not sent: missing configuration or recipient');
    return;
  }
  
  console.log(`Attempting to send email to ${to} for project ${project.pname}`);
  
  const subject = `Project ${action}: ${project.pname}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Workflows Engineering</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Project Management System</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #eee;">
            <h2 style="color: #667eea;">✅ Project Successfully ${action.charAt(0).toUpperCase() + action.slice(1)}</h2>
            
            <p>Hello ${project.pownername || 'Valued Client'},</p>
            
            <p>We're pleased to inform you that your project has been successfully ${action} in our system:</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">${project.pname}</h3>
                <p style="margin: 5px 0;"><strong>Project Number:</strong> ${project.pnumber}</p>
                <p style="margin: 5px 0;"><strong>Project Code:</strong> ${project.pcode}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${project.plocation}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> ${project.pstatus}</p>
                <p style="margin: 5px 0;"><strong>Priority:</strong> ${project.ppriority}</p>
                <p style="margin: 5px 0;"><strong>Budget:</strong> $${Number(project.pbudget).toLocaleString()}</p>
            </div>
            
            <p>You will receive updates on this project throughout its lifecycle. If you have any questions, please contact our team.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/projects" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Project Details</a>
            </div>
            
            <p>Best regards,<br/>
            <strong>Workflows Engineering Team</strong></p>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Workflows Engineering | Constructing Excellence</p>
        </div>
    </body>
    </html>
  `;
  
  try {
    const info = await mailTransport.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId || info);
    return info;
  } catch (err) {
    console.error('Email send error:', err);
    throw err; // Re-throw to be caught by calling function
  }
}

async function sendProjectSMS(to, project, action = 'created') {
  // Don't send if SMS not configured or no recipient
  if (!to || !isSMSConfigured() || !twilioClient) {
    console.log('SMS not sent: missing configuration or recipient');
    console.log('SMS config check - to:', to, 'isSMSConfigured():', isSMSConfigured(), 'twilioClient:', !!twilioClient);
    return;
  }
  
  console.log(`Attempting to send SMS to ${to} for project ${project.pname}`);
  
  try {
    const msg = await twilioClient.messages.create({
      body: `✅ Workflows Engineering: Your project "${project.pname}" (${project.pnumber}) has been successfully ${action}. View details at http://localhost:3000/projects`,
      from: process.env.TWILIO_PHONE,
      to,
    });
    console.log('SMS sent successfully:', msg.sid);
    return msg;
  } catch (err) {
    console.error('SMS send error:', err);
    throw err; // Re-throw to be caught by calling function
  }
}


exports.getAllProjects = getAllProjects;
exports.insertProject = insertProject;
exports.getProjectById = getProjectById;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
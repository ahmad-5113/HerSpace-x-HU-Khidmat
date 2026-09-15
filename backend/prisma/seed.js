import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const initialInternships = [
  {
    title: 'Social Media Intern',
    slug: 'social-media-intern',
    description: "Help amplify HerSpace's voice across digital platforms. Create engaging content, write blog posts, and support newsletter production.",
    location: 'Remote',
    workplace_type: 'Remote',
    duration: '3 months',
    deadline: new Date('2026-08-23T23:59:59Z')
  },
  {
    title: 'Community Engagement Intern',
    slug: 'community-engagement-intern',
    description: "Work directly with communities to support HerSpace's grassroots programs. Help organize workshops and coordinate with local partners.",
    location: 'Jamshoro, Sindh',
    workplace_type: 'On-Site',
    duration: '6 months',
    deadline: new Date('2026-08-26T23:59:59Z')
  },
  {
    title: 'Research Intern',
    slug: 'research-intern',
    description: 'Assist with SRHR and climate justice research and reporting, supporting the team with literature reviews and policy briefs.',
    location: 'Karachi, Sindh',
    workplace_type: 'Hybrid',
    duration: '4 months',
    deadline: new Date('2026-08-30T23:59:59Z')
  },
  {
    title: 'Advocacy & Legal Aid Intern',
    slug: 'advocacy-legal-aid-intern',
    description: 'Support policy advocacy and legal aid casework for youth, drafting briefs and coordinating with partner legal networks.',
    location: 'Remote',
    workplace_type: 'Remote',
    duration: '3 months',
    deadline: new Date('2026-08-30T23:59:59Z')
  },
  {
    title: 'Climate Justice Campaigner',
    slug: 'climate-justice-campaigner',
    description: 'Lead climate resilience education initiatives, organize environmental youth dialogues, and support disaster relief tracking.',
    location: 'Jamshoro, Sindh',
    workplace_type: 'Hybrid',
    duration: '6 months',
    deadline: new Date('2026-09-15T23:59:59Z')
  },
  {
    title: 'Youth SRHR Project Associate',
    slug: 'youth-srhr-project-associate',
    description: 'Collaborate on community health awareness campaigns, youth wellness toolkits, and interactive webinars across educational institutions.',
    location: 'Remote',
    workplace_type: 'Remote',
    duration: '4 months',
    deadline: new Date('2026-09-20T23:59:59Z')
  }
];

const initialBlogs = [
  {
    title: 'Developing Confident and Successful Learners',
    slug: 'developing-confident-and-successful-learners',
    cover_image: '/assets/img_027.jpg',
    body: JSON.stringify([
      'True academic success begins with a secure and supportive foundation. By grounding our educational spaces in fundamental values like dignity and mutual respect, we empower students to confidently embrace challenges and reach their full potential.',
      "Through HerSpace's youth-led workshops, participants are encouraged to voice their ideas, question assumptions, and take ownership of their learning journey. This sense of agency builds not just academic confidence but also the courage to advocate for themselves and their communities.",
      "When young people feel safe, seen, and supported, they don't just succeed in the classroom — they carry that confidence into every space they enter next."
    ]),
    author_name: 'HerSpace Team',
    status: 'PUBLISHED',
    published_at: new Date('2026-08-10T10:00:00Z')
  },
  {
    title: 'Enjoy Learning with a Unique Classroom Experience',
    slug: 'enjoy-learning-with-a-unique-classroom-experience',
    cover_image: '/assets/img_028.jpg',
    body: JSON.stringify([
      'Education is most effective when it is dynamic and collaborative. Our unique classroom model moves beyond traditional lectures to create an engaging, inclusive environment where diverse perspectives drive meaningful learning.',
      'HerSpace facilitators use participatory tools — group discussions, role play, and community mapping — to help young people connect abstract ideas about gender justice and climate action to their own lived experience.',
      'The result is a classroom that feels less like a lecture hall and more like a movement space: one where every voice has room to be heard.'
    ]),
    author_name: 'HerSpace Team',
    status: 'PUBLISHED',
    published_at: new Date('2026-08-15T10:00:00Z')
  },
  {
    title: 'Passionate Teachers That Make a Difference',
    slug: 'passionate-teachers-that-make-a-difference',
    cover_image: '/assets/img_029.jpg',
    body: JSON.stringify([
      'Our educators are dedicated mentors who look beyond the standard curricula. Whether conducting lessons in the classroom or facilitating open-air discussions, they are committed to supporting individual growth and inspiring lifelong curiosity.',
      "Many of HerSpace's facilitators are themselves young leaders who have come up through our programs — meaning the mentorship students receive comes from people who have walked a similar path.",
      "That shared experience builds trust quickly, and trust is often the first ingredient young people need before they're willing to speak up, take risks, and lead."
    ]),
    author_name: 'HerSpace Team',
    status: 'PUBLISHED',
    published_at: new Date('2026-08-20T10:00:00Z')
  }
];

const initialUsers = [
  {
    name: 'HerSpace SuperAdmin',
    email: 'admin@herspace.org',
    password_plain: 'AdminPassword123!',
    role: 'SUPER_ADMIN'
  },
  {
    name: 'HerSpace HR Lead',
    email: 'hr@herspace.org',
    password_plain: 'HrPassword123!',
    role: 'HR_MANAGER'
  },
  {
    name: 'HerSpace Content Editor',
    email: 'editor@herspace.org',
    password_plain: 'EditorPassword123!',
    role: 'CONTENT_EDITOR'
  }
];

async function main() {
  console.log('🌱 Seeding administrative staff accounts...');
  for (const user of initialUsers) {
    const password_hash = await bcrypt.hash(user.password_plain, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password_hash,
        role: user.role,
        is_email_verified: true,
        approval_status: 'APPROVED',
        is_active: true
      },
      create: {
        name: user.name,
        email: user.email,
        password_hash,
        role: user.role,
        is_email_verified: true,
        approval_status: 'APPROVED',
        is_active: true
      }
    });
  }
  console.log(`✅ Seeded ${initialUsers.length} admin accounts successfully.`);

  console.log('🌱 Seeding initial internships...');
  for (const job of initialInternships) {
    await prisma.internship.upsert({
      where: { slug: job.slug },
      update: {
        title: job.title,
        description: job.description,
        location: job.location,
        workplace_type: job.workplace_type,
        duration: job.duration,
        deadline: job.deadline,
        is_active: true
      },
      create: job
    });
  }
  console.log(`✅ Seeded ${initialInternships.length} internships successfully.`);

  console.log('🌱 Seeding initial blogs...');
  for (const blog of initialBlogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        cover_image: blog.cover_image,
        body: blog.body,
        author_name: blog.author_name,
        status: blog.status,
        published_at: blog.published_at
      },
      create: blog
    });
  }
  console.log(`✅ Seeded ${initialBlogs.length} blogs successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

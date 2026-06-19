interface JobContext {
  jobTitle: string;
  jobDescription: string;
  requiredSkills?: string[];
  budget?: number;
  clientName?: string;
  jobType?: 'hourly' | 'fixed';
}

interface FreelancerProfile {
  name: string;
  skills: string[];
  experience: string;
  portfolio?: string;
  rate?: number;
  rateType?: 'hourly' | 'fixed';
}

export class ProposalGenerator {
  private profile: FreelancerProfile | null = null;

  setProfile(profile: FreelancerProfile): void {
    this.profile = profile;
  }

  generateProposal(job: JobContext): string {
    const greeting = this.generateGreeting(job);
    const introduction = this.generateIntroduction(job);
    const relevance = this.generateRelevance(job);
    const process = this.generateProcess(job);
    const closing = this.generateClosing(job);

    return [greeting, introduction, relevance, process, closing].filter(Boolean).join('\n\n');
  }

  private generateGreeting(job: JobContext): string {
    if (job.clientName) {
      return `Hi ${job.clientName},`;
    }
    return 'Hi there,';
  }

  private generateIntroduction(job: JobContext): string {
    const lines = [
      `I'm interested in working on "${job.jobTitle}". I believe I'm a strong fit for this project because of my experience in ${this.profile?.skills.join(', ')}.`,
    ];

    if (this.profile?.experience) {
      lines.push(`I have substantial experience with ${this.profile.experience}.`);
    }

    return lines.join(' ');
  }

  private generateRelevance(job: JobContext): string {
    if (!job.requiredSkills || job.requiredSkills.length === 0) {
      return '';
    }

    const relevantSkills = job.requiredSkills.filter((skill) =>
      this.profile?.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );

    if (relevantSkills.length === 0) {
      return `I have relevant expertise in this field and can quickly adapt to your specific requirements.`;
    }

    return `My expertise in ${relevantSkills.join(', ')} makes me well-suited for this project. I understand what's needed and can deliver quality results.`;
  }

  private generateProcess(job: JobContext): string {
    const lines = [
      'My approach:',
      '• I start by thoroughly understanding your requirements and expectations',
      '• I provide regular updates on progress',
      '• I ensure quality work and am happy to revise based on your feedback',
      '• I maintain clear communication throughout the project',
    ];

    return lines.join('\n');
  }

  private generateClosing(job: JobContext): string {
    const closing = ['I\'m confident I can deliver excellent results for this project.'];

    if (job.jobType === 'fixed' && this.profile?.rate) {
      closing.push(`My rate for fixed projects is competitive and based on scope.`);
    } else if (job.jobType === 'hourly' && this.profile?.rate) {
      closing.push(`My hourly rate is $${this.profile.rate}.`);
    }

    closing.push('Feel free to reach out if you have any questions. Looking forward to working with you!');

    return closing.join(' ');
  }
}

export const proposalGenerator = new ProposalGenerator();

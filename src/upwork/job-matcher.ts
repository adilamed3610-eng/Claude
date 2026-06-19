interface Job {
  id: string;
  title: string;
  description: string;
  category?: string;
  budget?: number;
  client?: {
    feedback_count: number;
    rating?: number;
  };
  requiredSkills?: string[];
  jobType?: 'hourly' | 'fixed';
}

interface ProfileSkills {
  [skill: string]: number; // proficiency level 0-100
}

interface MatchScore {
  jobId: string;
  title: string;
  totalScore: number;
  skillsMatch: number;
  budgetMatch: number;
  clientQuality: number;
  jobTypeMatch: number;
  recommendation: 'high' | 'medium' | 'low';
}

export class JobMatcher {
  private profileSkills: ProfileSkills = {};
  private preferredJobTypes: ('hourly' | 'fixed')[] = ['fixed'];
  private minBudget: number = 0;
  private maxBudget: number = Infinity;

  setProfileSkills(skills: ProfileSkills): void {
    this.profileSkills = skills;
  }

  setPreferences(options: {
    jobTypes?: ('hourly' | 'fixed')[];
    minBudget?: number;
    maxBudget?: number;
  }): void {
    if (options.jobTypes) this.preferredJobTypes = options.jobTypes;
    if (options.minBudget !== undefined) this.minBudget = options.minBudget;
    if (options.maxBudget !== undefined) this.maxBudget = options.maxBudget;
  }

  matchJob(job: Job): MatchScore {
    const skillsMatch = this.calculateSkillsMatch(job);
    const budgetMatch = this.calculateBudgetMatch(job);
    const clientQuality = this.calculateClientQuality(job);
    const jobTypeMatch = this.calculateJobTypeMatch(job);

    const totalScore =
      skillsMatch * 0.4 + budgetMatch * 0.25 + clientQuality * 0.2 + jobTypeMatch * 0.15;

    const recommendation = this.getRecommendation(totalScore);

    return {
      jobId: job.id,
      title: job.title,
      totalScore: Math.round(totalScore * 100) / 100,
      skillsMatch: Math.round(skillsMatch * 100),
      budgetMatch: Math.round(budgetMatch * 100),
      clientQuality: Math.round(clientQuality * 100),
      jobTypeMatch: Math.round(jobTypeMatch * 100),
      recommendation,
    };
  }

  matchJobs(jobs: Job[]): MatchScore[] {
    return jobs
      .map((job) => this.matchJob(job))
      .sort((a, b) => b.totalScore - a.totalScore);
  }

  private calculateSkillsMatch(job: Job): number {
    if (!job.requiredSkills || job.requiredSkills.length === 0) {
      return 0.7; // neutral score if no skills specified
    }

    const matchedSkills = job.requiredSkills.filter(
      (skill) => this.profileSkills[skill.toLowerCase()] >= 60
    );

    return matchedSkills.length / job.requiredSkills.length;
  }

  private calculateBudgetMatch(job: Job): number {
    if (!job.budget) return 0.5;

    if (job.budget < this.minBudget) {
      return Math.max(0, 1 - (this.minBudget - job.budget) / this.minBudget);
    }

    if (job.budget > this.maxBudget) {
      return Math.max(0, 1 - (job.budget - this.maxBudget) / this.maxBudget);
    }

    return 1.0;
  }

  private calculateClientQuality(job: Job): number {
    if (!job.client) return 0.5;

    const rating = job.client.rating || job.client.feedback_count / 10;
    return Math.min(1, rating / 5);
  }

  private calculateJobTypeMatch(job: Job): number {
    if (!job.jobType) return 0.5;
    return this.preferredJobTypes.includes(job.jobType) ? 1 : 0.5;
  }

  private getRecommendation(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.75) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }
}

export const jobMatcher = new JobMatcher();

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  is_free: boolean;
  price: number | null;
  order: number;
  active: boolean;
  level: "entry" | "intermediate" | "advanced";
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  content_type: "video" | "text" | "interactive" | "quiz";
  content: string;
  video_url: string | null;
  order: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface UserEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export interface CourseInvite {
  id: string;
  course_id: string;
  email: string;
  token: string;
  invited_by: string | null;
  created_at: string;
  expires_at: string;
}

export interface ModuleQuiz {
  id: string;
  module_id: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correct: number;
  }[];
  xp_reward: number;
  created_at: string;
}

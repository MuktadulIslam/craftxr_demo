
interface Institute {
  institute_name: string;
  institute_alias: string;
}

interface School {
  school_name: string;
  school_alias: string;
}

interface Department {
  department_name: string;
}

interface ProgramAffiliation {
  affiliation_id: string;
  program_name: string;
  program_abbr: string;
  program_affiliation: string;
  institute: Institute;
  school: School;
  department: Department;
}

// Type for the array of programs
export type ProgramListResponse = ProgramAffiliation[];

export interface Program {
  program_name: string;
  program_abbr: string;
  institute: Institute;
  school: School;
  department: Department;
}

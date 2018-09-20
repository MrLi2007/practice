import { colors } from '../color';
export const DummyResource=[
    {
      name: "Saquib",
      utilization: "100%",
      availability:"0%",
      billable:"100%",
      nonBillable:"0%",
      employeeType:"consultant",
      nameofProjects: [{
        
        name: "AWH",
        color: colors.billableProject,
        start: "2018-06-09",
        end: "2018-06-10",
        percentage: "50%"
      },{

        name: "LMS",
        color: colors.billableProject,
        start: "2018-06-09",
        end: "2018-06-10",
        percentage: "50%"
      }],
      percentage: {
        e1: "50%",
        e2: "100%"
      },
      startDate: "2018-06-09",
      endDate: "2018-06-15"
    },
    {
      name: "Ashfaque",
      utilization: "95%",
      availability:"5%",
      billable:"75%",
      nonBillable:"20%",
      employeeType:"permanent",
      nameofProjects: [{

        name: "RMI",
        color: colors.nonBillableProject,
        start: "2018-06-09",
        end: "2018-06-10",
        percentage: "20%"
      },
      {
        name: "LMS",
        color: colors.billableProject,
        start: "2018-06-09",
        end: "2018-06-10",
        percentage: "75%"
      }],
      percentage: {
        e1: "50%",
        e2: "100%"
      },
      startDate: "2018-06-09",
      endDate: "2018-06-16"
    },
    {
      name: "Ayushi",
      utilization: "90%",
      availability:"10%",
      billable:"0%",
      nonBillable:"90%",
      employeeType:"consultant",
      nameofProjects: [{

        name: "RMI",
        color: colors.nonBillableProject,
        start: "2018-06-08",
        end: "2018-06-10",
        percentage: "90%"
      }],

      percentage: {
        e1: "50%",
        e2: "100%"
      },
      startDate: "2018-06-09",
      endDate: "2018-06-15"
    }
  ]
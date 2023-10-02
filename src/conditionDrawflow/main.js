import { ConditionDrawflow } from './ConditionDrawflow';

document.addEventListener("DOMContentLoaded", function() {
    console.log('EEEE')
    let a = new ConditionDrawflow('app');
    // a.test()
    console.log(a)
    console.log(a.testLog())
    //
    let b = {
        "m": [
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_aeYCl": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_hK4y3": "undefined"
                }
            }
        ],
        "mrmrt": [
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_b7YBh": "undefined"
                }
            },
            {
                "title_name": "Rotate",
                "title_content": {
                    "goal_o1CAr": "undefined",
                    "angle_o1CAr": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_m18ra": "undefined"
                }
            },
            {
                "title_name": "Rotate",
                "title_content": {
                    "goal_w9IzZ": "undefined",
                    "angle_w9IzZ": "undefined"
                }
            }
        ],
        "mrat": [
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_rOGxq": "undefined"
                }
            }
        ],
        "testReact": [
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_CDJ4J": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_BODe6": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_hdlbE": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_01XUD": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_EeYoe": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_ZorrC": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_d9ibs": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_FOSLm": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_g0AU4": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_4MEa2": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_MSVxY": "undefined"
                }
            },
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_q9SnS": "undefined"
                }
            }
        ],
        "mv": [
            {
                "title_name": "Nav2Client",
                "title_content": {
                    "goal_O9qjb": "undefined"
                }
            }
        ]
    }


    console.log(b)
    a.updateDrawFlowOption(b)
    console.log(a)
    //
});
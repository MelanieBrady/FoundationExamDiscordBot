/* https://beginnersbook.com/2015/04/json-tutorial/ */

const { Client, Discord, RichEmbed } = require('discord.js');
var mongoose = require('mongoose'); 
var fs = require('fs');
var config = require('./config.json'); //get out of root directory

const bot = new Client();

const token = config.test_token;


const PREFIX = "!";
var feExamDay = new Date("January 11, 2020 10:00:00");

//Log files :) 
fs.open('feature_requests.log', 'a', function (err, file) {
  if (err) throw err;
});

//Feedback to know the file is on! 
bot.on('ready', () => {
    console.log('This bot is online!');
})

//Send dm to new memebers - Need to check if it works 
bot.on("guildMemberAdd", member => {
    member.send("Welcome")
        .catch(console.error);
});

//console.log(message);
//Try catch all of this below 

bot.on('message', message => {
    if (!message.content.startsWith(PREFIX)) return; 
    let args = message.content.toLowerCase().substring(PREFIX.length).split(" ");

    switch (args[0]) {
        
        case 'request': case 'requests' : case 'feature': case 'bug' :
                fs.appendFile('feature_requests.log', message.author.tag + ": " + args.slice(1).join(" ") + "\n", function (err) {
                if (err) throw err;
                console.log('logged feature: ' + args.join(" "));
                message.channel.send("Logged! Thanks for letting us know! :smile: ")
                });
            break;

        case 'help' : case 'helps' :
            var help = new RichEmbed()
                .setColor(0x3498DB)
                .setTitle("Here's all the cool stuff I can do:")
                .setDescription("!signup\nLink to sign up for FE\n!countdown\nCountdown until exam day\n!faq\nLink to FAQ\n!sections\nHow the FE is sectioned\n!outline\nMaster List of what to know for FE\n!exam <SemesterYYYY>\nLink to that exam\n!solutions <SemesterYYYY>\nLink to solutions for that exam\n!stats <SemesterYYYY>\nLink to how people did when they took it!\n!needtoknow <subject>\nJust what you need to for that subject\n!reference\nThe FE reference sheet\n!hi\nSay hello :smile:\n!request\nFeature requests!\n");
                //Add this in when it works !<exam/solutions/stats> <SemesterYear> <link/file/scoreupdate>\nYou'll be sent the exam
                //!<exam/solutions/stats> <SemesterYear> 
            message.reply({ embed: help });
            break;

        case 'signup':
            var signup =  new RichEmbed()
                .setColor(0x3498DB)
                .setTitle('Foundation Exam Signup Form')
                .setDescription('Follow me to sign up :)')
                .setURL('https://www.cs.ucf.edu/registration/new/index.php');
            message.reply({ embed: signup });
            break;
        
        case 'countdown':
            calculateTime(); 
            break;

        case 'faq': 
            var faq = new RichEmbed()
                .setColor(0x3498DB)
                .setTitle('Foundation Exam FAQ')
                .setDescription('Follow me for the FAQ file :)')
                .setURL('http://www.eecs.ucf.edu/cs/files/foundation_exam/FAQ-2017.pdf');
            message.reply({ embed: faq });
            break; 
        
        case 'sections': case 'section':
            var section = new RichEmbed()
                .setColor(0x3498DB)
                .setTitle('Foundation Exam Sections')
                .setDescription('Data Structures (DS) Part A\nData Structures (DS) Part B\nAlgorithms and Analysis Tools (AL) Part A\nAlgorithms and Analysis Tools (AL) Part B');
            message.reply({ embed: section });
            break; 
    
        case 'outline' : 
            var outline = new RichEmbed()
                .setColor(0x3498DB)
                .setTitle('Foundation Exam Outline')
                .setDescription('Follow me for the Exam outline file :)')
                .setURL('http://www.eecs.ucf.edu/cs/files/foundation_exam/ExamOutline.pdf');
            message.reply({ embed: outline });
            break; 

        case 'reference': case 'formula': case 'referencesheet' : case 'formulasheet' :
            var reference = new RichEmbed()
                .setColor(0x3498DB)
                .setTitle('Foundation Exam Reference Sheet')
                .setDescription('Follow me for the given reference sheet during the exam :)')
                .setURL('http://www.eecs.ucf.edu/cs/files/foundation_exam/FormulaSheet.pdf');
            message.reply({ embed: reference });
            break;

        case 'needtoknow': case 'expectations': case 'expectation': 
            subjectSwitch(args); 
            break;
    
       case 'exam' : case 'exams' : case 'questions' : case 'question': 
            examSwitch(args);
            break; 

        case 'answers' : case 'answer' : case 'solutions' : case 'solution' : case 'sol':
            solutionSwitch(args);
            break;

        case 'stats': case 'stat':  case 'statistics' : case 'statistic' :
            statsSwitch(args);
            break;

        default:
            if (!message.author.bot) { quirks(args); } 
            break;
    }

    function subjectSwitch(args) {
        var text = new RichEmbed()
            .setColor(0x3498DB)
            .setTitle("Need to know for " + args[1] + ":");

        switch (args[1]) {
            case 'all' :
                text.setDescription("Here's the file to the master list");
                text.setURL("http://www.eecs.ucf.edu/cs/files/foundation_exam/ExamOutline.pdf"); break;
            case 'dynamicmemory': case 'dynmem' : case 'dynamicmemoryallocation' :
                text.setDescription("-For a struct\n-For an array\n-For a 2D array\n-For an array of arrays.\n-Solving problems with arrays.\n-Freeing memory in all cases"); break;
            case 'linkedlists': case 'linkedlist':
                text.setDescription("-How to allocate space for a new node (malloc)\n-When to check for NULL\n-What free does\n-Iteration vs. Recursion\n-Insertion\n-Deletion\n-Structural Modification\n"); break;
            case 'stacks': case 'queues': case 'stack' : case 'queue':
                text.setDescription("-Converting infix to postfix expressions\n-Evaluating postfix expressions\n-Array Implementation\n-Linked List Implementation\n"); break;
            case 'binarytree': case 'bst': case "binarysearchtrees":
                text.setDescription("-How to allocate space for a new node (malloc)\n-When to check for NULL\n-Tree Traversals\n-What free does\n-Using recursion with trees\n-Computing sum of nodes\n-Computing height\n-Other variants");break;
            case 'heaps': case 'heap':
                text.setDescription('-Insertion\n-Delete Min/Max'); break;
            case 'avl': case 'avltrees':
                text.setDescription("-Tracing inserts\n-Tracing deletes\n-Searching for a value"); break;
            case 'hash': case 'hasttables': case 'hashtable':
                text.setDescription('-Hash Function Properties\n-Linear Probing Strategy\n-Quadratic Probing Strategy\n-Separate Chaining Hashing'); break;
            case 'tries': case 'trie':
                text.setDescription("-Tracing inserts\n-Searching for a word"); break;
            case 'bigocode': case 'bigofromcode': case 'codebigo':
                text.setDescription('Algorithim Analysis:\n-Known Data Structures\n-Best, Average, Worst Cases\n-Based on various implementations\n-New Problem Analysis')
            case 'bigotime': case 'timing': case 'time':
                text.setDescription("Timing Questions:\n-Set up correctly with an unknown constant\n-Solve for the constant.\n-Use direct formula to answer the question\n-For loop questions, write out summations")
            case 'recurrencerelations' : case 'recurrence': case 'bigorecurrence':
                text.setDescription('Recurrence Relations:\n-Break them down into multiple summations if necessary\n-Evaluate each of those using summation formulas.\n-Remember that indices of summation are important.\n-The n in the formula is JUST a variable!!!\n-Deriving recurrence relation from code\n-Using iteration to solve recurrence relations')
            case 'bigo' : case 'bigoall': 
                text.setDescription("Algorithim Analysis:\n-Known Data Structures\n-Best, Average, Worst Cases\n-Based on various implementations\n-New Problem Analysis'\n\nTiming Questions:\n-Set up correctly with an unknown constant\n-Solve for the constant.\n-Use direct formula to answer the question\n-For loop questions, write out summations\n\nRecurrence Relations:\n-Break them down into multiple summations if necessary\n-Evaluate each of those using summation formulas.\n-Remember that indices of summation are important.\n-The n in the formula is JUST a variable!!!\n-Deriving recurrence relation from code\n-Using iteration to solve recurrence relations"); break;
            case 'recursion': case 'recursivecoding': case 'recurse': case 'recusivecode':
                text.setDescription("-Need a terminating condition\n-Need an algorithm for non-terminating case.\n-In particular, you must reduce a question to “smaller” instances of the same question.\n-Do not try to think of an iterative solution\n-Towers of Hanoi solution and recursion\n-Permutation\n-Floodfill"); break;
            case 'sorts': case 'sort': case 'sorting':
                text.setDescription("-Insertion Sort\n-Selection Sort\n-Bubble Sort\n-Merge Sort (Merge)\n-Quick Sort (Partition)"); break;
            case 'bitwise': case 'bitwiseoperator': case 'bitwiseoperations':
                text.setDescription("\-Mechanics of &, |, ^, >>, <<.\n-Corresponding set meanings.\n-How to check if a bit is on or off in a number."); break;
            case 'backtracking': case 'backtrack': 
                text.setDescription('-Build solution step by step\n-Cut out of any unviable branches\n-Use of recursion'); break; 
            default: 
                if (!message.author.bot) {
                    text.setTitle("How your invalid input makes me feel:");
                    text.setDescription("Misunderstood, confused, disappointed, and slightly hungry");
                }
                break;
            }

            message.reply({ embed: text });
        }

    function examSwitch(args) {
        var link = new RichEmbed()
            .setColor(0x3498DB)
            .setTitle("Exam for " + args[1])
            .setDescription('Follow me for the ' + args[1] + ' file :)')


        switch (args [1]) {
            case  'fall2019' : case 'fall19' : case 'f19' : case 'fa2019' : case 'fa19': 
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2019/FE-Aug19.pdf'); 
                break;
            case 'summer2019': case 'summer19' : case 'sum2019' : case 'sum19': case 'su19' : 
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2019/FE-May19.pdf'); 
                break;
            case 'spring2019': case 'spring19' : case 'sp19': case 'sp2019':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2019/FE-Jan19.pdf'); 
                break;
            case 'fall2018': case 'fall18': case 'f18': case 'fa2018' : case 'fa18':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2018/FE-Aug18.pdf'); 
                break;
            case 'summer2018': case 'summer18' : case 'sum2018' : case 'sum18': case 'su18' :
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2018/FE-May18.pdf'); 
                break;
            case 'spring2018': case 'spring18' : case 'sp18': case 'sp2018':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2018/FE-Jan18.pdf'); 
                break;
            case 'fall2017': case 'fall17': case 'f17': case 'fa2017' : case 'fa17':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2017/FE-Aug17.pdf'); 
                break;
            case 'summer2017': case 'summer17' : case 'sum2017' : case 'sum17': case 'su17' :
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2017/FE-May17.pdf'); 
                break;
            case 'spring2017': case 'spring17' : case 'sp17': case 'sp2017':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2017/FE-Jan17.pdf'); 
                break;
            case 'fall2016': case 'fall16': case 'f16': case 'fa2016' : case 'fa16':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2016/FE-Dec16.pdf'); 
                break;
            default: 
                if (!message.author.bot) {
                    link.setTitle("How your invalid input makes me feel:");
                    link.setDescription("Misunderstood, confused, disappointed, and slightly hungry");
                }
                break;
            }

        message.reply({ embed: link });
    }

    function solutionSwitch(args) {
        var link = new RichEmbed()
            .setColor(0x3498DB)
            .setTitle("Solutions for " + args[1] + " exam"); 
        
        switch (args [1]) {
            case 'fall2019': case 'fall19': case 'f19': case 'fa2019' : case 'fa19':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2019/FE-Aug19-Sol.pdf'); 
                break;
            case 'summer2019': case 'summer19' : case 'sum2019' : case 'sum19': case 'su19' : 
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2019/FE-May19-Sol.pdf'); 
                break;
            case 'spring2019': case 'spring19' : case 'sp19': case 'sp2019':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2019/FE-Jan19-Sol.pdf'); 
                break;
            case  'fall2018': case 'fall18': case 'f18': case 'fa2018' : case 'fa18':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2018/FE-Aug18-Sol.pdf'); 
                break;
            case 'summer2018': case 'summer18' : case 'sum2018' : case 'sum18': case 'su18' :
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2018/FE-May18-Sol.pdf'); 
                break;
            case 'spring2018': case 'spring18' : case 'sp18': case 'sp2018':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2018/FE-Jan18-Sol.pdf'); 
                break;
            case 'fall2017': case 'fall17': case 'f17': case 'fa2017' : case 'fa17':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2017/FE-Aug17-Sol.pdf'); 
                break;
            case 'summer2017': case 'summer17' : case 'sum2017' : case 'sum17': case 'su17' :
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2017/FE-May17-Sol.pdf'); 
                break;
            case 'spring2017': case 'spring17' : case 'sp17': case 'sp2017':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2017/FE-Jan17-Sol.pdf'); 
                break;
            case 'fall2016': case 'fall16': case 'f16': case 'fa2016' : case 'fa16':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2016/FE-Dec16-Sol.pdf'); 
                break;
            default: 
                if (!message.author.bot) {
                    link.setTitle("How your invalid input makes me feel:");
                    link.setDescription("Misunderstood, confused, disappointed, and slightly hungry");
                }
                break;
            }

        message.reply({ embed: link });
    }

    function statsSwitch(args) {
        var link = new RichEmbed()
            .setColor(0x3498DB)
            .setTitle("Stats for " + args[1]); 

        switch (args [1]) {
            case  'fall2019' : case 'fall19' : case 'f19' : case 'fa2019' : case 'fa19': 
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2019/Info-Aug19.pdf'); 
                break;
            case 'summer2019': case 'summer19' : case 'sum2019' : case 'sum19': case 'su19' : 
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2019/Info-May19.pdf'); 
                break;
            case 'spring2019': case 'spring19' : case 'sp19': case 'sp2019':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2019/Info-Jan19.pdf'); 
                break;
            case 'fall2018': case 'fall18': case 'f18': case 'fa2018' : case 'fa18':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2018/Info-Aug18.pdf'); 
                break;
            case 'summer2018': case 'summer18' : case 'sum2018' : case 'sum18': case 'su18' :
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2018/Info-May18.pdf'); 
                break;
            case 'spring2018': case 'spring18' : case 'sp18': case 'sp2018':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2018/Info-Jan18.pdf'); 
                break;
            case 'fall2017': case 'fall17': case 'f17': case 'fa2017' : case 'fa17':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2017/Info-Aug17.pdf'); 
                break;
            case 'summer2017': case 'summer17' : case 'sum2017' : case 'sum17': case 'su17' :
                link.setURL('http://www.cs.ucf.edu/registration/exm/sum2017/Info-May17.pdf'); 
                break;
            case 'spring2017': case 'spring17' : case 'sp17': case 'sp2017':
                link.setURL('http://www.cs.ucf.edu/registration/exm/spr2017/Info-Jan17.pdf'); 
                break;
            case 'fall2016': case 'fall16': case 'f16': case 'fa2016' : case 'fa16':
                link.setURL('http://www.cs.ucf.edu/registration/exm/fall2016/Info-Dec16.pdf'); 
                break;    
            default: 
                if (!message.author.bot) {
                    link.setTitle("How your invalid input makes me feel:");
                    link.setDescription("Misunderstood, confused, disappointed, and slightly hungry");
                }
                break;                    
            }

        message.reply({ embed: link });
    }

    function calculateTime() {
        var timeDif = Date.parse(feExamDay) - Date.parse(new Date());

        if (timeDif > 0) {
            var months = Math.floor(timeDif / (24 * 60 * 60 * 1000 * 7 * 4))
            var weeks = Math.floor(timeDif / (24 * 60 * 60 * 1000 * 7) % 4)
            var days = Math.floor((timeDif / (24 * 60 * 60 * 1000)) % 7)
            var hours = Math.floor((timeDif / (1000 * 60 * 60)) % 24)
            var minutes = Math.floor((timeDif / 1000 / 60) % 60)

            var countdown = new RichEmbed()
                .setTitle('Countdown to Exam Day:')
                .setColor(0x3498DB)

            if (months > 0) {
                countdown.setDescription(months + ' months\n' + weeks + ' weeks\n' + days + ' days\n' + hours + ' hours\n' + minutes + ' minutes');
            } else if (months <= 0) {
                countdown.setDescription(weeks + ' weeks\n' + days + ' days\n' + hours + ' hours\n' + minutes + ' minutes');
            } else if (months <= 0 && weeks <= 0) {
                countdown.setDescription(days + ' days\n' + hours + ' hours\n' + minutes + ' minutes');
            } else if (months <= 0 && weeks <= 0 && days <= 0) {
                countdown.setDescription(hours + ' hours\n' + minutes + ' minutes');
            } else if (months <= 0 && weeks <= 0 && days <= 0 && hours <= 0) {
                countdown.setDescription(minutes + ' minutes');
            }

            message.channel.send({ embed: countdown });

            //Update to have @notification for whoever is the admin :)
        } else {
            message.channel.send("Pls pester admin to reset the foundation exam time :face_with_monocle:");
        }
    }

    function quirks(args) {
        switch (args[0]) {
            case 'hi': case 'hello': case 'howdy': case 'aloha': case 'hey':
                message.channel.send('Hello friend!'); break;
            case 'ping':
                message.channel.send('pong! :ping_pong:'); break;
            case 'beep':
                message.channel.send('boop! :robot:'); break;
            case ':3' : case ':)' : case 'uwu' : case ':heart:' : case '<3': case 'c:': 
                message.channel.send("Oh " + args.join(" ") + " you too :heart:"); break;
            case ':c' : case ':(' : 
                message.channel.send(message.author + " I hope you feel better :heart:"); break;
            case 'rawr': case 'moo': 
                message.channel.send('rooooaaaawwwrrr :lion:'); break; 
            default: 
                responsesThatOnlyAmuseMe(); break; 
        }

        /*  -CS Poetry - switch through a list of cs poetry
            -inspiration - tells you can do it in creative ways
            -aggressive coach - insults you to tell you to do better
            -participation award - says you tried
            -celebration
            -pity party */ 
    }

    function responsesThatOnlyAmuseMe() {
        var random = Math.floor(Math.random() * 100) % 14; 

        switch(random) {
            case 0: 
                message.channel.send(message.author + ' is not my real dad >:C'); break;
            case 1: 
                message.channel.send(message.author + ' hates joy'); break;
            case 2: 
                message.channel.send("There's no easy way to say this, " + message.author + ", " + args.join(" ") + ' is just invalid.');  break;
            case 3: 
                message.channel.send("All right, " + message.author + " a response to " + args.join(" ") + " is in the pipeline. We'll have it dropped within 3-5 business days. It may leave a small impact crater on your front lawn, but we cannot be responsible for any lawncare expenses."); break; 
            case 4: 
                message.channel.send("HEY " + message.author + "! You don't get to tell me when to " + args.join(" ") + "!"); break; 
            case 5: 
                message.channel.send("Great" + message.author + ". Now you broke " + args.join(" ") + "."); break;
            case 6: 
                message.channel.send("Ah, " + args.join(" ") + " are the words I love to hear from " + message.author + " the most."); break; 
            case 7: 
                message.channel.send("Don't look now, but there's one " + args.join(" ") + " too many in this room and I think it's " + message.author); break;
            case 8:     //Well now undefined is too funny to me to properly fix xD
                message.channel.send("It's " + Date.parse(new Date).getHour + " 'o' clock, " + message.author + ". You awake in a panic. You're wasting your life? Relax. It'll be over soon. Enjoy Arbys."); break; 
            case 9: 
                message.channel.send("STAWP " + message.author + "! You are up to no good with your " + args.join(" ") + "!"); break;
            case 10: 
                message.channel.send("Stop that you trouble maker " + message.author + "!"); break;
            case 11: 
                message.channel.send(args.join(" ") + " me yourself " + message.author); break;
            case 12: 
                message.channel.send("Don't make me " + args.join(" ") + " >:) " + message.author); break;
            case 13: 
                message.channel.send("Some cause " + args.join(" ") + " wherever they go; others, whenever they go. -- " + message.author); break;
        }
    }
})

bot.login(token);


/*

Exam "Class" 
    Name = SemesterYYYY
    Exam link 
    Exam file
    Solutions link
    Solutions file
    Stats link 
    Stats file

So someone can easily add a new exam to the database 

    score, averages w/ users on discord & stats when it was taken 

Subject (aka Data Structure / Algorithms) "Class"
    Name = lowercase, spelled out, no spaces 
    List = Laundry list of what you're expected to know
    Big O Runtimes
    Extra resources & links
    Extra problems from LeetCode
    Index from where it normally is in exams  - unless I get the random function working - although this will be harder to maintain so maybe not

    
Try these: 
    !request <Your ideas for new features, bugs, and/or feedback so we can log it on our end>
    !help to see all it can do :) 


 Mybe a runtime command would be nice
'!runtimes' or something could list all the important runtimes to know for the FE
You could also have the different sorts as commands maybe
'!bubble_sort' could say its runtime and how it works
same with '!merge_sort', '!quick_sort'
If you've got a list of questions you can have the bot randomly ask a question depending on the topic requested
And just manually type in the questions it could output depending on the category in the background

Future features I'll implement after finals: track your scores per attempt on each exam, big o per data structure/algorithm, resources for help for data structures and algorithms, and extra problems to practice. 

server automation
creating roles 

!play a menus for the dumb cute stuff it can do 

!request - Log for bot requests - Feature request 

!update function that adds new tests and  new data strutures to their respective lists 

    Practice Exam Scoring:
        Shares the stats from previous attempts from that semester
        Keep track of how you score as you practice. It'll save each attempts and even calculate averages :)
        Calculates averages for your personal scores (for each test and for all of tests) and averages for all test takers :)
        !attempt Fall2019 50
        !score Fall2019 me

    Backend: Get userID - trace with specific test, save the score, add mulitple attempts

Stats:

Generate Problems by data structure:
    LeetCode Data Structure/ Algorithm
    !LC Stacks Easy

Resources for help! <3
    Links me to data structure/algorithms resources
    !help heaps

Cute dumb roles/titles for users to create - no real permission if possible


*/
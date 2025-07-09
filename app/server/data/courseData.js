import mongoose from "mongoose";

export const exampleCourse = {
  title: "Mastering JavaScript for Web Development",
  description:
    "Dive deep into JavaScript fundamentals and advanced concepts, enabling you to build dynamic, interactive web applications with confidence.",
  category: "Web Development",
  imageUrl:
    "https://miro.medium.com/v2/resize:fit:1200/1*LyZcwuLWv2FArOumCxobpA.png",
  topics: [
    {
      title: "JavaScript Fundamentals",
      skills: [
        {
          skillTitle: "Introduction to JavaScript",
          content: `
<p>
JavaScript is a versatile, high-level programming language that forms the backbone of interactive web experiences. As the language of the browser, it enables developers to create dynamic and responsive websites that engage users effectively. Unlike HTML and CSS, which provide structure and styling, JavaScript adds behavior, interactivity, and the ability to manipulate the Document Object Model (DOM) to your websites.
</p>

<p>
Originally developed by Brendan Eich in 1995, JavaScript has evolved significantly, transforming from a simple scripting language to a powerful tool used in full-stack development, mobile applications, and even game development. It supports object-oriented, imperative, and functional programming styles, allowing developers flexibility in how they approach problem-solving.
</p>

<img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript Logo" style="width:50%;margin:auto;display:block;">

<p>
JavaScript's integration with HTML and CSS enables developers to build visually appealing and interactive user interfaces. The language is executed within the browser's JavaScript engine, allowing code to run on the client side without requiring server interactions for every action, leading to faster and smoother user experiences. By mastering JavaScript, you will gain the ability to create modern web applications, manipulate page content in real-time, and handle asynchronous operations, which are essential skills in the tech industry.
</p>

<p>
JavaScript is also essential for building complex web applications using frameworks like React, Vue, and Angular. These frameworks rely heavily on JavaScript to manage application state, handle user interactions, and render dynamic content efficiently. As a developer, understanding JavaScript fundamentals will give you a strong foundation for exploring these advanced frameworks and libraries.
</p>

<p>
In this module, you will gain a thorough understanding of JavaScript's syntax, data types, and control flow, as well as learn how to write and structure your code effectively. By the end of this section, you will have the confidence to start building simple web applications and interactive components that enhance the user experience on your websites.
</p>
          `,
        },
        {
          skillTitle: "Understanding Variables",
          content: `
<p>
Variables in JavaScript act as containers for storing data values. They allow you to label data with a descriptive name, making your code more readable and maintainable. You can declare variables using <code>var</code>, <code>let</code>, or <code>const</code>, each with its own scoping rules and use cases. Understanding how to use variables effectively is critical for managing the state and logic of your applications.
</p>

<p>
The <code>var</code> keyword, which has been around since the inception of JavaScript, is function-scoped and can lead to issues like hoisting, where variables are moved to the top of their scope before code execution. To avoid these pitfalls, it is recommended to use <code>let</code> and <code>const</code>, introduced with ES6, which are block-scoped and provide better control over variable declarations.
</p>

<p>
<code>let</code> is used when you need to reassign values to a variable, while <code>const</code> is used for values that should remain constant throughout the program. For example:
</p>
<pre><code>let count = 0;
count = 5;

const API_KEY = "12345"; // This cannot be reassigned
</code></pre>

<p>
JavaScript is dynamically typed, meaning you don't need to specify the data type of a variable when declaring it. The type is determined automatically at runtime based on the value assigned to it. This flexibility allows you to write code quickly but also requires careful management to avoid unexpected behaviors during execution.
</p>

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Javascript-shield.svg/1200px-Javascript-shield.svg.png" alt="JavaScript Variables" style="width:60%;margin:auto;display:block;">

<p>
As you build more complex programs, understanding the nuances of variable scoping, hoisting, and best practices will help you write cleaner and more efficient code. This skill will also prepare you for advanced JavaScript concepts such as closures and module patterns.
</p>
          `,
        },
        {
          skillTitle: "Data Types in JavaScript",
          content: `
<p>
JavaScript supports several data types, including primitive types and reference types, which are essential for handling and processing data in your applications. The primitive types include <strong>String</strong>, <strong>Number</strong>, <strong>Boolean</strong>, <strong>Null</strong>, <strong>Undefined</strong>, and <strong>Symbol</strong>, while reference types include <strong>Objects</strong> and <strong>Arrays</strong>.
</p>

<p>
Strings represent text and are defined using single or double quotes. Numbers include integers and floating-point values, and JavaScript does not differentiate between different numeric types. Booleans represent logical values of <code>true</code> and <code>false</code>, while <code>null</code> signifies the intentional absence of any object value, and <code>undefined</code> indicates a variable that has been declared but not assigned a value.
</p>

<img src="https://www.tutorialsteacher.com/Content/images/js/js-data-types.png" alt="Data Types" style="width:60%;margin:auto;display:block;">

<p>
Objects are collections of key-value pairs, allowing you to store and access related data efficiently. Arrays are ordered collections of values, which can be accessed using index numbers starting from zero. Both objects and arrays form the backbone of data management in JavaScript applications.
</p>

<p>
Understanding data types in JavaScript is crucial for writing effective code. It allows you to choose the appropriate data structures for your applications, perform type conversions when necessary, and debug issues related to unexpected data types during execution.
</p>
          `,
        },
        {
          skillTitle: "Control Flow and Logical Operations",
          content: `
<p>
Control flow in JavaScript determines the order in which statements are executed in your program. By using conditional statements and loops, you can control the execution based on conditions and perform repetitive tasks efficiently.
</p>

<p>
Conditional statements include <code>if</code>, <code>else if</code>, and <code>else</code>, which allow you to execute specific blocks of code based on the evaluation of expressions. The <code>switch</code> statement provides an alternative way to handle multiple conditions more cleanly.
</p>

<p>
Loops, including <code>for</code>, <code>while</code>, and <code>do...while</code>, allow you to execute blocks of code repeatedly based on specified conditions. This is useful for tasks such as iterating over arrays, processing data, and performing repetitive actions.
</p>

<img src="https://www.w3schools.com/js/js_loop_for.png" alt="JavaScript Loops" style="width:60%;margin:auto;display:block;">

<p>
Logical operators like <code>&&</code> (AND), <code>||</code> (OR), and <code>!</code> (NOT) enable you to create complex conditions for decision-making in your programs. Understanding these control structures and logical operations will allow you to write more powerful and flexible code in your applications.
</p>
          `,
        },
      ],
      quiz: [
        {
          question:
            "Which keyword should you use for block-scoped variable declarations?",
          options: ["var", "let", "const", "Both let and const"],
          correctAnswer: "Both let and const",
        },
        {
          question:
            "Which of the following is NOT a JavaScript primitive type?",
          options: ["String", "Object", "Boolean", "Undefined"],
          correctAnswer: "Object",
        },
      ],
    },

    {
      title: "Functions and Scope in JavaScript",
      skills: [
        {
          skillTitle: "Understanding Functions",
          content: `
    <p>
    Functions are reusable blocks of code designed to perform specific tasks in your programs. They allow you to write modular, organized, and reusable code, significantly improving maintainability and scalability. In JavaScript, functions are first-class citizens, meaning they can be assigned to variables, passed as arguments to other functions, and returned from functions.
    </p>
    
    <p>
    A basic function is declared using the <code>function</code> keyword:
    </p>
    <pre><code>
    function greet(name) {
      console.log("Hello, " + name);
    }
    greet("Alice");
    </code></pre>
    
    <p>
    Functions help you break complex problems into smaller, manageable tasks. They can accept parameters, which act as placeholders for the values passed during the function call, and return values to the caller using the <code>return</code> statement.
    </p>
    
    <img src="https://cdn.educba.com/academy/wp-content/uploads/2019/12/Functions-in-JavaScript.jpg" alt="Functions in JavaScript" style="width:60%;margin:auto;display:block;">
    
    <p>
    You will learn how to use named functions, anonymous functions, and arrow functions effectively, enabling you to write clean and concise code.
    </p>
          `,
        },
        {
          skillTitle: "Arrow Functions",
          content: `
    <p>
    Introduced in ES6, arrow functions provide a shorter syntax for writing functions in JavaScript. They are especially useful for writing concise callback functions and for maintaining the lexical scope of the <code>this</code> keyword.
    </p>
    
    <p>
    The syntax is:
    </p>
    <pre><code>
    const add = (a, b) => a + b;
    </code></pre>
    
    <p>
    Arrow functions do not have their own <code>this</code> binding, which makes them ideal for situations where you need to preserve the context of <code>this</code> in methods and callbacks.
    </p>
    
    <img src="https://miro.medium.com/v2/resize:fit:1200/1*FzMUVUosb8cdQz0jNm4gTg.png" alt="Arrow Functions" style="width:60%;margin:auto;display:block;">
    
    <p>
    In this section, you will practice using arrow functions in various scenarios to understand their behavior and advantages.
    </p>
          `,
        },
        {
          skillTitle: "Understanding Scope",
          content: `
    <p>
    Scope determines the accessibility of variables and functions in different parts of your code. In JavaScript, there are three types of scope: global, function, and block scope.
    </p>
    
    <p>
    Variables declared outside of any function or block are globally scoped and accessible throughout your code. Variables declared inside functions are function-scoped, meaning they are only accessible within that function. Variables declared with <code>let</code> or <code>const</code> within a block (like inside an <code>if</code> statement) are block-scoped.
    </p>
    
    <img src="https://www.digitalocean.com/_next/image?url=https%3A%2F%2Fdigitalocean.com%2Fstatic%2F91ab6e6f79b51fc3f6eb63b9d34658f6%2F61aa6%2Fjavascript_scope_diagram.png&w=3840&q=75" alt="JavaScript Scope" style="width:60%;margin:auto;display:block;">
    
    <p>
    Understanding scope is essential for managing data flow in your applications, avoiding variable collisions, and writing bug-free code.
    </p>
          `,
        },
        {
          skillTitle: "Closures in JavaScript",
          content: `
    <p>
    A closure is a function that has access to its own scope, the outer function's scope, and the global scope. Closures are created every time a function is created and are a powerful feature of JavaScript that allows for data encapsulation and the creation of private variables.
    </p>
    
    <p>
    Example:
    </p>
    <pre><code>
    function outer() {
      let count = 0;
      return function inner() {
        count++;
        console.log(count);
      }
    }
    const counter = outer();
    counter(); // 1
    counter(); // 2
    </code></pre>
    
    <img src="https://cdn.programiz.com/sites/tutorial2program/files/javascript-closure.png" alt="JavaScript Closures" style="width:60%;margin:auto;display:block;">
    
    <p>
    Closures allow you to create factory functions, manage asynchronous operations effectively, and implement module patterns for encapsulation.
    </p>
          `,
        },
      ],
      quiz: [
        {
          question: "Which keyword is used to define a function in JavaScript?",
          options: ["function", "func", "define", "fn"],
          correctAnswer: "function",
        },
        {
          question: "Arrow functions do not have their own ____ context.",
          options: ["scope", "this", "variable", "function"],
          correctAnswer: "this",
        },
      ],
    }, 
    
    {
      title: "Asynchronous JavaScript and APIs",
      skills: [
        {
          skillTitle: "Understanding Synchronous vs Asynchronous JavaScript",
          content: `
    <p>
    JavaScript is single-threaded, executing one operation at a time in a synchronous manner. However, many operations in web development, such as network requests or file reading, take time to complete. Waiting for these operations synchronously would block the main thread, making your web application unresponsive.
    </p>
    
    <p>
    Asynchronous programming allows JavaScript to handle long-running operations without blocking the execution of other code. This is achieved through mechanisms like callbacks, promises, and the <code>async/await</code> syntax introduced in ES8.
    </p>
    
    <img src="https://www.syncfusion.com/blogs/wp-content/uploads/2022/08/Synchronous-vs-Asynchronous-in-JavaScript.png" alt="Synchronous vs Asynchronous JavaScript" style="width:60%;margin:auto;display:block;">
    
    <p>
    In this section, you will learn the differences between synchronous and asynchronous execution and understand why asynchronous programming is critical for building responsive web applications.
    </p>
          `,
        },
        {
          skillTitle: "Using Callbacks",
          content: `
    <p>
    Callbacks are functions passed as arguments to other functions, to be executed once an asynchronous operation completes. They are the foundation of asynchronous programming in JavaScript but can lead to deeply nested structures, commonly referred to as "callback hell."
    </p>
    
    <pre><code>
    function fetchData(callback) {
      setTimeout(() => {
        callback("Data received");
      }, 1000);
    }
    fetchData((data) => {
      console.log(data);
    });
    </code></pre>
    
    <img src="https://miro.medium.com/v2/resize:fit:1200/1*Zq8-GBQ1hUvA1Xj9CIRIAg.png" alt="Callback Hell" style="width:60%;margin:auto;display:block;">
    
    <p>
    You will practice writing callback-based asynchronous functions and understand their limitations in larger applications.
    </p>
          `,
        },
        {
          skillTitle: "Working with Promises",
          content: `
    <p>
    Promises provide a cleaner alternative to callbacks for handling asynchronous operations. A promise represents a value that may be available now, in the future, or never, with three states: <strong>pending</strong>, <strong>fulfilled</strong>, and <strong>rejected</strong>.
    </p>
    
    <pre><code>
    const fetchData = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Data received");
      }, 1000);
    });
    fetchData.then(data => console.log(data)).catch(err => console.error(err));
    </code></pre>
    
    <p>
    Promises allow chaining asynchronous operations and error handling using <code>then</code> and <code>catch</code>, improving code readability and maintainability.
    </p>
    
    <img src="https://blog.logrocket.com/wp-content/uploads/2020/12/Promises-in-JavaScript.png" alt="Promises in JavaScript" style="width:60%;margin:auto;display:block;">
    
    <p>
    By mastering promises, you will be able to write clearer, more structured asynchronous code.
    </p>
          `,
        },
        {
          skillTitle: "Using Async/Await",
          content: `
    <p>
    The <code>async/await</code> syntax simplifies working with promises by allowing you to write asynchronous code in a synchronous style. Functions declared with <code>async</code> return a promise, and within them, you can use <code>await</code> to pause execution until a promise resolves.
    </p>
    
    <pre><code>
    async function fetchData() {
      try {
        const data = await getData();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
    </code></pre>
    
    <p>
    This syntax makes your code easier to read and debug, reducing complexity when handling multiple asynchronous operations.
    </p>
    
    <img src="https://cdn.educba.com/academy/wp-content/uploads/2020/02/Async-Await-in-JavaScript.png" alt="Async Await in JavaScript" style="width:60%;margin:auto;display:block;">
    
    <p>
    You will practice using <code>async/await</code> for network requests and asynchronous logic within your projects.
    </p>
          `,
        },
        {
          skillTitle: "Fetching Data from APIs",
          content: `
    <p>
    APIs (Application Programming Interfaces) allow your applications to communicate with other services to fetch or send data. The <code>fetch</code> API in JavaScript is a modern, promise-based way to make network requests.
    </p>
    
    <pre><code>
    async function fetchUser() {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const user = await response.json();
      console.log(user);
    }
    fetchUser();
    </code></pre>
    
    <p>
    By learning to work with APIs, you will be able to build data-driven applications that can interact with servers, fetch dynamic content, and submit user data securely.
    </p>
    
    <img src="https://www.codementor.io/blog/async-await-fetch-17k8vj3sgx" alt="Fetching Data from APIs" style="width:60%;margin:auto;display:block;">
    
    <p>
    You will also learn about handling API errors, displaying loading indicators, and updating your UI based on data fetched from APIs in real-time.
    </p>
          `,
        },
      ],
      quiz: [
        {
          question: "Which keyword is used to pause execution until a promise is resolved?",
          options: ["pause", "await", "stop", "yield"],
          correctAnswer: "await",
        },
        {
          question: "Which of these is NOT a state of a Promise?",
          options: ["fulfilled", "pending", "completed", "rejected"],
          correctAnswer: "completed",
        },
      ],
    },
  ],
  creator: new mongoose.Types.ObjectId("686d3622b95602004ffbba14"),
  dateCreated: new Date(),
  isPublished: true,
};


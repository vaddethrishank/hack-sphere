// /lib/codeExecutor.ts

/**
 * NOTE: This is a BACKEND SIMULATION.
 * In a real-world application, this logic would live on a secure server.
 * This server would receive code from the frontend, execute it in a sandboxed
 * environment (e.g., a Docker container) to prevent security risks, and return
 * the output. Services like Judge0, Sphere Engine, or a custom-built microservice
 * would handle this.
 *
 * For this project, we're simulating that API call within the frontend to
 * demonstrate the architecture without requiring a separate server.
 */

// interface ExecutionResult {
//     output: string | null;
//     error: string | null;
// }

// // A simple, "cheating" simulator for non-JavaScript languages for the Palindrome problem.
// const simulateExecution = (code: string, language: string, input: any): ExecutionResult => {
//     const isPalindrome = (str: string) => {
//         const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");
//         if (cleanStr.length === 0) return true;
//         return cleanStr === cleanStr.split("").reverse().join("");
//     };

//     const expectedResult = isPalindrome(input);

//     let looksCorrect = false;
//     switch (language) {
//         case 'python':
//             // Check for common Python palindrome logic
//             looksCorrect = code.includes('lower()') && code.includes('[::-1]');
//             break;
//         case 'java':
//             // Check for common Java palindrome logic
//             looksCorrect = code.includes("StringBuilder") && code.includes("reverse()") && code.includes("equals");
//             break;
//         case 'cpp':
//              // Check for common C++ palindrome logic
//             looksCorrect = code.includes("std::string") && code.includes("std::reverse");
//             break;
//     }

//     if (looksCorrect) {
//         return { output: JSON.stringify(expectedResult), error: null };
//     }
//     // Return the opposite for incorrect code to show failed test cases
//     return { output: JSON.stringify(!expectedResult), error: null };
// };


// export const executeCode = async (
//     code: string,
//     language: string,
//     input: string
// ): Promise<ExecutionResult> => {
//     // Simulate network delay for the API call
//     await new Promise(res => setTimeout(res, 700));

//     if (language === 'javascript') {
//         try {
//             // This is a simplified and somewhat insecure way to run JS code.
//             // A real backend would use a more robust sandboxing method.
//             const userFunction = new Function(`return ( ${code} )`)();
//             const result = userFunction(JSON.parse(input));
//             return { output: JSON.stringify(result), error: null };
//         } catch (e: any) {
//             return { output: null, error: e.message };
//         }
//     } else {
//         // For other languages, use the simulator
//         try {
//             return simulateExecution(code, language, JSON.parse(input));
//         } catch (e: any) {
//             return { output: null, error: "Simulation failed: Invalid input format." };
//         }
//     }
// };

// /lib/codeExecutor.ts

// export const executeCode = async (code: string, language: string, input: string) => {
//   try {
//     const response = await fetch("http://localhost:4000/api/execute", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         code,
//         language,
//         testCases: [{ input, expectedOutput: "" }], // expectedOutput can be empty for run
//       }),
//     });

//     const data = await response.json();
//     const firstResult = data.results?.[0] || {};
//     return { output: firstResult.output, error: null };
//   } catch (err: any) {
//     return { output: "", error: err.message };
//   }
// };





// export const executeCode = async (code: string, language: string, input: string) => {
//   try {
//     console.log("🚀 EXECUTE START -----------------------------");
//     console.log("Language:", language);
//     console.log("Code Preview:", code.substring(0, 150));
//     console.log("Input Sent:", JSON.stringify(input));

//     const body = {
//       language,
//       version: "*",
//       files: [{ name: "main.cpp", content: code }],
//       stdin: input,
//       args: [],
//       compile_timeout: 20000,
//       run_timeout: 20000,
//       compile_memory_limit: -1,
//       run_memory_limit: -1
//     };

//     console.log("📤 Request Body:", JSON.stringify(body, null, 2));

//     const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body)
//     });

//     console.log("📥 Raw Response:", response);

//     const data = await response.json();

//     console.log("📦 Parsed Response:", JSON.stringify(data, null, 2));

//     const output = data.run?.output?.trim() || "";
//     const stderr = data.run?.stderr || "";
//     const stdout = data.run?.stdout || "";

//     console.log("🖨️ STDOUT:", JSON.stringify(stdout));
//     console.log("⚠️ STDERR:", JSON.stringify(stderr));
//     console.log("🟩 FINAL OUTPUT:", JSON.stringify(output));

//     console.log("🚀 EXECUTE END -----------------------------");

//     return { output, error: null };
//   } catch (err: any) {
//     console.error("❌ ERROR IN EXECUTION:", err);

//     return { output: "", error: err.message };
//   }
// };




export const executeCode = async (code, language, input) => {
  try {
    console.log("Running with JUDGE0...");

    const langMap = {
      cpp: 54,      // g++ (C++17)
      c: 50,
      python: 71,
      java: 62,
      js: 63,
    };

    const response = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: langMap[language],
          stdin: input,
        }),
      }
    );

    const data = await response.json();

    const output =
      data.stdout?.trim() ||
      data.stderr?.trim() ||
      data.compile_output?.trim() ||
      "";

    return { output, error: null };
  } catch (err) {
    return { output: "", error: err.message };
  }
};

Chart.register(window['chartjs-plugin-annotation']);

function sayHi() {
    alert("Hello from JS!");
}

async function runPiSimulation() {
    const response = await fetch("/api/pi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulations: 50, samples_per_sim: 10000 }),
    });

    const data = await response.json();
    drawPiChart(data.estimates);
}

function drawPiChart(estimates) {
    const avg = estimates.reduce((a, b) => a + b, 0) / estimates.length;

    const ctx = document.getElementById("piChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: estimates.map((_, i) => `Sim ${i + 1}`),
            datasets: [{
                label: "Estimated pi",
                data: estimates,
                backgroundColor: "#6495ED",
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    annotations: {
                        averageLine: {
                            type: "line",
                            yMin: avg,
                            yMax: avg,
                            borderColor: "green",
                            borderWidth: 2,
                            label: {
                                content: `Avg: ${avg.toFixed(4)}`,
                                enabled: true,
                                position: "end"
                            }
                        },
                        piLine: {
                            type: "line",
                            yMin: 3.14159,
                            yMax: 3.14159,
                            borderColor: "red",
                            borderWidth: 2,
                            label: {
                                content: "pi: 3.14159",
                                enabled: true,
                                position: "start"
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 3.0,
                    max: 3.2
                }
            }
        },
    });
}

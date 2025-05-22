let piChart = null;

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

    // Destroy the previous chart if it exists
    if (piChart) {
        piChart.destroy();
    }

    const ctx = document.getElementById("piChart").getContext("2d");
    piChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: estimates.map((_, i) => `Sim ${i + 1}`),
            datasets: [{
                label: "Estimated π",
                data: estimates,
                backgroundColor: "#89b4fa",
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
                            borderColor: "#a6e3a1",
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
                            borderColor: "#f38ba8",
                            borderWidth: 2,
                            label: {
                                content: "π ≈ 3.14159",
                                enabled: true,
                                position: "start"
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    suggestedMin: 3.0,
                    suggestedMax: 3.3
                }
            }
        }
    });
}
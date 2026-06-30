# ── Stage 1: Build with Maven ──
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run with slim JRE ──
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/inventoryApplication-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9898
ENTRYPOINT ["java", "-jar", "app.jar"]

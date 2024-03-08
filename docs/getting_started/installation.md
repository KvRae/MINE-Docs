## Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- Android Studio
- JDK 17
- Android SDK with minimum SDK version 24 and target SDK version 34
- Gradle 8.2

## Installation

To integrate the Indoor Navigation Engine library into your Android project, follow these steps:

### Gradle

1. Open your project's `build.gradle` file.
2. Add the following dependency in the `dependencies` block:

Groovy DSL
```groovy
    dependencies {
        implementation 'com.machinestalk:indoornavigationengine:1.0.0'
    }
```
Kotlin DSL
```kotlin
    dependencies {
        implementation("com.machinestalk:indoornavigationengine:1.0.0")
    }
```

### Maven

1. Open your project's `pom.xml` file.
2. Add the following dependency:

    ```xml
    <dependency>
        <groupId>com.machinestalk</groupId>
        <artifactId>indoornavigationengine</artifactId>
        <version>1.0.0</version>
        <type>pom</type>
    </dependency>
    ```


## Important Note
> **NOTE**: This library uses [Filament](https://github.com/google/filament),
> a native library written in C++ for rendering 3D graphics, which requires Java version 17. 
> Ensure your `build.gradle` file is configured accordingly:

```groovy
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
}
kotlinOptions {
    jvmTarget = '17'
}
```

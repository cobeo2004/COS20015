import { supabase } from "../supabase";
import type { Database } from "../supabase/generated";
import type { DeveloperMetadata } from "../types/hybrid-data";
import { isDeveloperMetadata } from "../types/hybrid-data";

type DeveloperRow = Database["public"]["Tables"]["developers"]["Row"];

/**
 * Repository for developers table with JSONB metadata support
 * Handles structured data (name, email) and semi-structured data (metadata JSONB)
 */
export class DevelopersRepository {
  /**
   * Get all developers
   */
  static async getAllDevelopers() {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch developers: ${error.message}`);
    }
    return data;
  }

  /**
   * Get developer by ID with metadata
   */
  static async getDeveloperById(id: string) {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch developer: ${error.message}`);
    }
    return data;
  }

  /**
   * Get developers with metadata parsed
   * Returns typed metadata for easier access
   */
  static async getDevelopersWithMetadata(): Promise<Array<DeveloperRow & { parsedMetadata: DeveloperMetadata | null }>> {
    const developers = await this.getAllDevelopers();

    return developers.map(dev => ({
      ...dev,
      parsedMetadata: this.parseMetadata(dev.metadata)
    }));
  }

  /**
   * Filter developers by company size (from JSONB metadata)
   * Example: filterByCompanySize('Large (200-500)')
   */
  static async filterByCompanySize(companySize: DeveloperMetadata['company_size']) {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .contains("metadata", { company_size: companySize });

    if (error) {
      throw new Error(`Failed to filter by company size: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter developers by specialty (from JSONB metadata array)
   * Uses JSONB array containment operator
   */
  static async filterBySpecialty(specialty: string) {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .contains("metadata", { specialties: [specialty] });

    if (error) {
      throw new Error(`Failed to filter by specialty: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter developers founded after a certain year
   * Uses JSONB field extraction and comparison
   */
  static async filterByFoundedYear(minYear: number) {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .gte("metadata->>founded_year", minYear.toString());

    if (error) {
      throw new Error(`Failed to filter by founded year: ${error.message}`);
    }
    return data;
  }

  /**
   * Get developers with their logo URLs
   * Focuses on unstructured data (image URLs)
   */
  static async getDevelopersWithLogos() {
    const { data, error } = await supabase
      .from("developers")
      .select("id, name, logo_url")
      .not("logo_url", "is", null);

    if (error) {
      throw new Error(`Failed to fetch developers with logos: ${error.message}`);
    }
    return data;
  }

  /**
   * Search developers by headquarters location (from JSONB metadata)
   */
  static async searchByHeadquarters(city?: string, country?: string) {
    let query = supabase.from("developers").select("*");

    if (city) {
      query = query.contains("metadata", { headquarters: { city } });
    }
    if (country) {
      query = query.contains("metadata", { headquarters: { country } });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to search by headquarters: ${error.message}`);
    }
    return data;
  }

  /**
   * Get developers with awards count
   * Extracts array length from JSONB metadata
   */
  static async getDevelopersWithAwardsCount() {
    const developers = await this.getDevelopersWithMetadata();

    return developers.map(dev => ({
      id: dev.id,
      name: dev.name,
      logo_url: dev.logo_url,
      awards_count: dev.parsedMetadata?.awards?.length || 0,
      awards: dev.parsedMetadata?.awards || []
    }));
  }

  /**
   * Parse metadata JSONB into typed DeveloperMetadata
   * Validates and returns typed metadata or null
   */
  private static parseMetadata(metadata: unknown): DeveloperMetadata | null {
    if (!metadata) return null;

    // Validate using type guard
    if (isDeveloperMetadata(metadata)) {
      return metadata as DeveloperMetadata;
    }

    // If validation fails, return null
    console.warn("Invalid developer metadata format:", metadata);
    return null;
  }

  /**
   * Extract specific metadata field
   * Helper method for JSONB field access
   */
  static extractMetadataField<K extends keyof DeveloperMetadata>(
    metadata: unknown,
    field: K
  ): DeveloperMetadata[K] | undefined {
    const parsed = this.parseMetadata(metadata);
    return parsed?.[field];
  }

  /**
   * Get developers ordered by a JSONB metadata field
   */
  static async orderByMetadataField(field: keyof DeveloperMetadata, ascending: boolean = true) {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .order(`metadata->${field}`, { ascending });

    if (error) {
      throw new Error(`Failed to order by metadata field: ${error.message}`);
    }
    return data;
  }
}
